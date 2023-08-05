const { validationResult } = require( "express-validator" );

const dbContext = require( "../model/dbContext" );
const messagingUtil = require( '../utility/messaging' );
const errorsType = require( "../utility/errorsType" );

exports.getBudgets = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;

    const Budgets = await dbContext.getBudgetsFromDb( userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "BUDS" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/budgets";
    responseData.docTitle = "Budgets";
    responseData.budgets = Budgets;

    return res.render( "./Budget/budgets", responseData );
};

exports.getAddBudgets = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/budgets";
    responseData.docTitle = "Add Budget";
    return res.render( "./Budget/add-budget", responseData );
};

exports.postAddBudgets = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle validation results 
    if ( !errors.isEmpty() )
    {
        const responseData = res.locals.responseData;
        responseData.path = "/budgets";
        responseData.docTitle = "Budgets";
        responseData.error = errors.array()[ 0 ].msg;
        return res.render( "./Budget/add-budget", responseData );
    };

    const name = req.body.budgetName;
    const amount = req.body.budgetAmount;
    const goal = req.body.budgetGoal;
    const description = req.body.budgetDescription;
    const active = req.body.budgetActive === 'on' ? true : false;
    const userId = req.session.USER.dataValues.id;

    await dbContext.addBudgetToDb( name, amount, goal, description, active, userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_CREATE + "BUDS" ) );
        } );

    return res.redirect( "/budgets" );
};

exports.getEditBudgets = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    let responseData;
    const budgetId = req.params.id;
    const targetedBudget = await dbContext.findBudgetInDp( budgetId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "BUDS" ) );
        } );

    responseData = res.locals.responseData;
    responseData.path = "/budgets";
    responseData.docTitle = "Edit Budget";
    responseData.budget = targetedBudget;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }

    return res.render( "./Budget/edit-budget", responseData );
};

exports.postEditBudgets = async function ( req, res, next )
{
    const budgetId = req.body.budgetId;

    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req, { message: errors.array()[ 0 ].msg } );
        return res.redirect( `/edit-budgets/${ budgetId }` );
    };

    const name = req.body.budgetName;
    const amount = req.body.budgetAmount;
    const goal = req.body.budgetGoal;
    const description = req.body.budgetDescription;

    await dbContext.updateBudgetInDp( budgetId, name, amount, goal, description )
        .catch( (err) =>
        { 
            console.log( err );
            return next( new Error( errorsType.DB_ERROR_UPDATE + "BUDS" ) );
        } );

    return res.redirect( "/budgets" );
};

exports.getDeleteBudgets = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const budgetId = req.params.id;

    await dbContext.deleteBudgetFromDb( budgetId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_DELETE + "BUDS" ) );
        } );

    return res.redirect( "/budgets" );
};

exports.getActivateBudgets = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const budgetId = req.params.id;
    await dbContext.activateBudgetInDb( budgetId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_UPDATE + "BUDS" ) );
        } );

    return res.redirect( "/budgets" );
};
