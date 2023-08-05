const { validationResult } = require( "express-validator" );

const filtersUtil = require( "../utility/filters" );
const dbContext = require( "../model/dbContext" );
const errorsType = require( "../utility/errorsType" );
const messagingUtil = require( '../utility/messaging' );

exports.getExpenses = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;
    const [ Budgets, Categories, Expenses ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.getExpensesFromDb( userId, {}, [ 'budget', 'category' ] )
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "EXP" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/expenses";
    responseData.docTitle = "Expenses";
    responseData.expenses = Expenses;
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    return res.render( "./Expense/expenses", responseData );
};

exports.getAddExpenses = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;

    const [ Budgets, Categories ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "EXP" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/expenses";
    responseData.docTitle = "Add Expense";
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }

    return res.render( "./Expense/add-expense", responseData );
};

exports.postAddExpenses = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req , { message: errors.array()[ 0 ].msg } );
        return res.redirect( "/add-expenses" );
    };

    const name = req.body.expenseName;
    const amount = req.body.expenseAmount;
    const description = req.body.expenseDescription;
    const budgetId = req.body.expenseBudgetId;
    const categoryId = req.body.expenseCategoryId;
    const userId = req.session.USER.dataValues.id;

    await dbContext.addExpenseToDb( name, amount, description, budgetId, categoryId, userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_CREATE + "EXP" ) );
        } );

    return res.redirect( "/expenses" );
};

exports.getEditExpenses = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const userId = req.session.USER.dataValues.id;
    const expenseId = req.params.id;

    const [ Budgets, Categories, targetedExpense ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.findExpenseInDb( expenseId )
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "EXP" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/expenses";
    responseData.docTitle = "Edit Expense";
    responseData.budgets = Budgets;
    responseData.categories = Categories;
    responseData.expense = targetedExpense;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }

    res.render( "./Expense/edit-expense", responseData );
};

exports.postEditExpenses = async function ( req, res, next )
{

    const expenseId = req.body.expenseId;
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req , { message: errors.array()[ 0 ].msg } );
        return res.redirect( `/edit-expenses/${expenseId}`);
    };
    const name = req.body.expenseName;
    const amount = req.body.expenseAmount;
    const description = req.body.expenseDescription;
    const budgetId = req.body.expenseBudgetId;
    const categoryId = req.body.expenseCategoryId;

    await dbContext.updateExpenseInDp( expenseId, name, amount, description, budgetId, categoryId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_UPDATE + "EXP" ) );
        } );
    ;

    return res.redirect( "/expenses" );
};

exports.getDeleteExpenses = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const expenseId = req.params.id;

    await dbContext.deleteExpenseFromDp( expenseId );

    return res.redirect( "/expenses" );
};

exports.postFilterExpenses = async function ( req, res, next )
{
    const requestDateFilter = req.body.dateFilter;
    const requestBudgetFilter = +req.body.budgetFilter;
    const requestCategoryFilter = +req.body.categoryFilter;
    const userId = req.session.USER.dataValues.id;

    //* If no date filter provided, redirect to the incomes page
    if ( !( requestDateFilter || requestBudgetFilter || requestCategoryFilter ) )
    {
        return res.redirect( "/expenses" );
    }

    //* Get the SQL query options using "filtersUtil.getOptionsObject" which format and specify the needed options correctly 
    const options = filtersUtil.getOptionsObject( requestDateFilter, requestBudgetFilter, requestCategoryFilter );
    
    const [ Budgets, Categories, Expenses ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.getExpensesFromDb( userId, options, [ 'budget', 'category' ] )
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "EXP" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/expenses";
    responseData.docTitle = "Expenses";
    responseData.expenses = Expenses;
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    return res.render( "./Expense/expenses", responseData );
};