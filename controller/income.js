const { validationResult } = require( "express-validator" );

const filtersUtil = require( "../utility/filters" );
const dbContext = require( "../model/dbContext" );
const errorsType = require( "../utility/errorsType" );
const messagingUtil = require( '../utility/messaging' );

exports.getIncmoes = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;
    const [ Budgets, Categories, Incomes ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.getIncomesFromDb( userId, {}, [ 'budget', 'category' ] )
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "INC" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/incomes";
    responseData.docTitle = "Incomes";
    responseData.incomes = Incomes;
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    return res.render( "./Income/incomes", responseData );
};

exports.getAddIncomes = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;

    const [ Budgets, Categories ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "INC" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/incomes";
    responseData.docTitle = "Add Income";
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }

    return res.render( "./Income/add-income", responseData );
};

exports.postAddIncomes = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject(req , { message: errors.array()[ 0 ].msg } );
        return res.redirect( "/add-incomes" );
    };

    const name = req.body.incomeName;
    const amount = req.body.incomeAmount;
    const description = req.body.incomeDescription;
    const budgetId = req.body.incomeBudgetId;
    const categoryId = req.body.incomeCategoryId;
    const userId = req.session.USER.dataValues.id;

    await dbContext.addIncomeToDb( name, amount, description, budgetId, categoryId, userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_CREATE + "INC" ) );
        } );

    return res.redirect( "/incomes" );
};

exports.getEditIncomes = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const userId = req.session.USER.dataValues.id;
    const incomeId = req.params.id;

    const [ Budgets, Categories, targetedIncome ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.findIncomeInDb( incomeId )
    ] )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "INC" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/incomes";
    responseData.docTitle = "Edit Income";
    responseData.budgets = Budgets;
    responseData.categories = Categories;
    responseData.income = targetedIncome;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }

    return res.render( "./Income/edit-income", responseData );
};

exports.postEditIncomes = async function ( req, res, next )
{
    const incomeId = req.body.incomeId;
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req , { message: errors.array()[ 0 ].msg } );
        return res.redirect( `/edit-incomes/${ incomeId }` );
    };

    const name = req.body.incomeName;
    const amount = req.body.incomeAmount;
    const description = req.body.incomeDescription;
    const budgetId = req.body.incomeBudgetId;
    const categoryId = req.body.incomeCategoryId;

    await dbContext.updateIncomeInDp( incomeId, name, amount, description, budgetId, categoryId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_UPDATE + "INC" ) );
        } );
    res.redirect( "/incomes" );
};

exports.getDeleteIncomes = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const incomeId = req.params.id;

    await dbContext.deleteIncomeFromDp( incomeId );

    return res.redirect( "/incomes" );
};

exports.postFilterIncomes = async function ( req, res, next )
{
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const requestDateFilter = req.body.dateFilter;
    const requestBudgetFilter = +req.body.budgetFilter;
    const requestCategoryFilter = +req.body.categoryFilter;
    const userId = req.session.USER.dataValues.id;

    //* If no date filter provided, redirect to the incomes page
    if ( !( requestDateFilter || requestBudgetFilter || requestCategoryFilter ) )
    {
        return res.redirect( "/incomes" );
    }

    //* Get the SQL query options using "filtersUtil.getOptionsObject" which format and specify the needed options correctly 
    const options = filtersUtil.getOptionsObject( requestDateFilter, requestBudgetFilter, requestCategoryFilter );

    const [ Budgets, Categories, Incomes ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId ),
        dbContext.getCategoriesFromDb( userId ),
        dbContext.getIncomesFromDb( userId, options, [ 'budget', 'category' ] )
    ] );

    const responseData = res.locals.responseData;
    responseData.path = "/incomes";
    responseData.docTitle = "Incomes";
    responseData.incomes = Incomes;
    responseData.budgets = Budgets;
    responseData.categories = Categories;

    return res.render( "./Income/incomes", responseData );
};