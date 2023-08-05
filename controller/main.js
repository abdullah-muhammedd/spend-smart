const { validationResult } = require( "express-validator" );

const dbContext = require( "../model/dbContext" );
const errorsType = require( "../utility/errorsType" );

exports.getIndex = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;
    const userName = req.session.USER.dataValues.firstName + " " + req.session.USER.dataValues.lastName;
    const [ Budgets, Incomes, Expenses ] = await Promise.all( [
        dbContext.getBudgetsFromDb( userId, {}, 5, 0 ),
        dbContext.getIncomesFromDb( userId, {}, [ 'budget', 'category' ], 5, 0 ),
        dbContext.getExpensesFromDb( userId, {}, [ 'budget', 'category' ], 5, 0 )
    ] )
        .catch( () =>
        {
            next( new Error( errorsType.DB_ERROR_SELECT + "MAIN" ) );
        } );

    const responseData = {
        ...res.locals.responseData,
        path: "/",
        docTitle: "Home",
        budgets: Budgets,
        incomes: Incomes,
        expenses: Expenses,
        userName: userName,
    };

    return res.render( "./Main/index", responseData );
};

exports.getChart = async function ( req, res, next )
{
    let userId = req.session.USER.dataValues.id;
    let { incomes, expenses } = await dbContext.getChartData( userId );
    return res.status( 200 ).json( { incomes, expenses } );
};

exports.getCSRF = function ( req, res, next )
{
    return res.status( 200 ).json( { csrfToken: req.csrfToken() } );
};