const express = require( "express" );
const router = express.Router();
const expenseCTRL = require( "../controller/expense" );
const isAuth = require( "../middlewares/isAuthanticated" );
const expenseValidatoin = require( "../utility/validation/expense" );

// GET /expenses
router.get( "/expenses",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseCTRL.getExpenses );

// GET /add-expenses
router.get( "/add-expenses",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseCTRL.getAddExpenses );

// POST /add-expenses
router.post( "/add-expenses",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseValidatoin.expenseValidationSchema,
    expenseCTRL.postAddExpenses );

// GET /edit-expenses/:@param{expenseId}
router.get( "/edit-expenses/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseValidatoin.expenseExistanceValidationSchema,
    expenseCTRL.getEditExpenses );

// POST /edit-expenses
router.post( "/edit-expenses",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseValidatoin.expenseValidationSchema,
    expenseCTRL.postEditExpenses );

// GET /delete-expenses/:@param{expenseId}
router.get( "/delete-expenses/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseValidatoin.expenseExistanceValidationSchema,
    expenseCTRL.getDeleteExpenses );

// POST /filter-Expenses/:@param{expenseId}
router.post( "/filter-expenses",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    expenseCTRL.postFilterExpenses );

module.exports = router;
