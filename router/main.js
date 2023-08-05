const express = require( "express" );
const router = express.Router();

const mainCTRL = require( "../controller/main" );
const isAuth = require( "../middlewares/isAuthanticated" );

// GET /
router.get( "/",
    isAuth.isLoggedIn,
    isAuth.isVerified,
    mainCTRL.getIndex );

router.get( "/get-csrf-token",
    mainCTRL.getCSRF );

// get some stats about the incomes and expenses 
router.get( "/charts-data", isAuth.isLoggedIn,
    isAuth.isVerified,
    mainCTRL.getChart );

module.exports = router;