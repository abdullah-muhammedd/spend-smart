const express = require( "express" );
const router = express.Router();
const budgetCTRL = require( "../controller/budget" );
const isAuth = require( "../middlewares/isAuthanticated" );
const budgetValidation = require( "../utility/validation/budget" );

// GET /budgets
router.get( "/budgets",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetCTRL.getBudgets );

// GET /add-budgets
router.get( "/add-budgets",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetCTRL.getAddBudgets );

// POST /add-budgets
router.post( "/add-budgets",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetValidation.budgetValidatoinSchema,
    budgetCTRL.postAddBudgets );

// GET /edit-budgets/@param{budgetId}
router.get( "/edit-budgets/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetValidation.budgetExistanceValidationSchema,
    budgetCTRL.getEditBudgets );

// POST /edit-budgets
router.post( "/edit-budgets",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetValidation.budgetValidatoinSchema,
    budgetCTRL.postEditBudgets );

// GET /delete-budgets/@param{budgetId}
router.get( "/delete-budgets/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetValidation.budgetExistanceValidationSchema,
    budgetCTRL.getDeleteBudgets );

// GET /activate-budgets/@param{budgetId}
router.get( "/activate-budgets/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    budgetValidation.budgetExistanceValidationSchema,
    budgetCTRL.getActivateBudgets );

module.exports = router;