const express = require( "express" );
const router = express.Router();
const categoryCTRL = require( "../controller/category" );
const isAuth = require( "../middlewares/isAuthanticated" );
const categoryValidation = require( "../utility/validation/category" );

// GET /categories
router.get( "/categories",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryCTRL.getCategories );

// GET /add-categories
router.get( "/add-categories",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryCTRL.getAddCategories );

// POST /add-categories
router.post( "/add-categories",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryCTRL.postAddCategories );

// GET /edit-categories/:@param{categoryId}
router.get( "/edit-categories/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryValidation.categoryExistanceValidationSchema,
    categoryCTRL.getEditCategories );

// POST /edit-categories
router.post( "/edit-categories",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryCTRL.postEditCategories );

// GET /delete-categories/:@param{categoryId}
router.get( "/delete-categories/:id",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryValidation.categoryExistanceValidationSchema,
    categoryCTRL.getDeleteCategories );

// POST /filter-Categories/:@param{categoryId}
router.post( "/filter-categories",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    categoryCTRL.postFilterCategories );

module.exports = router;