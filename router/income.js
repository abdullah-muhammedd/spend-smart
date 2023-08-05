const express = require( "express" );
const router = express.Router();
const incomeCTRL = require( "../controller/income" );;
const isAuth = require( "../middlewares/isAuthanticated" );
const incomeValidation = require( "../utility/validation/income" );

// GET /incomes
router.get( "/incomes",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeCTRL.getIncmoes );

// GET /add-incomes
router.get( "/add-incomes",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeCTRL.getAddIncomes );

// POST /add-incomes
router.post( "/add-incomes",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeValidation.incomeValidationSchema,
    incomeCTRL.postAddIncomes );

// GET /edit-incomes/:@param{incomeId}
router.get( "/edit-incomes/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeValidation.incomeExistanceValidationSchema,
    incomeCTRL.getEditIncomes );

// POST /edit-incomes
router.post( "/edit-incomes",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeValidation.incomeValidationSchema,
    incomeCTRL.postEditIncomes );

// GET /delete-incomes/:@param{incomeId}
router.get( "/delete-incomes/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeValidation.incomeExistanceValidationSchema,
    incomeCTRL.getDeleteIncomes );

// POST /filter-Incomes/:@param{incomeId}
router.post( "/filter-incomes",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    incomeCTRL.postFilterIncomes );

module.exports = router;
