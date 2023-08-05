const express = require( "express" );
const router = express.Router();
const authCTRL = require( "../controller/auth" );
const isAuth = require( "../middlewares/isAuthanticated" );
const authValidation = require( "../utility/validation/auth" );


// GET /signup
router.get( "/signup",
    isAuth.isNotLoggedIn,
    authCTRL.getSignup );

// POST /signup
router.post( "/signup",
    isAuth.isNotLoggedIn,
    authValidation.userCreationValidationSchema,
    authCTRL.postSignup );

// GET /verification-email-sent
router.get( "/verification-email-sent",
    authCTRL.getVerificationEmailSent );

// GET /verify-email/@param{token}
router.get( "/verify-email/:token",
    authValidation.tokenValidationSchema,
    authCTRL.getVerifyEmail );

// GET /login
router.get( "/login",
    isAuth.isNotLoggedIn,
    authCTRL.getLogin );

// POST /login
router.post( "/login",
    isAuth.isNotLoggedIn,
    authValidation.userCheckValidationSchema,
    authCTRL.postLogin );

// GET /logout
router.get( "/logout",
    isAuth.isLoggedIn,
    authCTRL.getLogout );

// GET /ask-to-reset-password
router.get( "/ask-to-reset-password",
    authCTRL.getAskToResetPassword );

// GET /ask-to-reset-password
router.post( "/ask-to-reset-password",
    authValidation.checkEmailOnly,
    authCTRL.postAskToResetPassword );

// GET /resetting-email-sent
router.get( "/resetting-email-sent",
    authCTRL.getResettingEmailSent );

// GET /reset-password/@param{token}
router.get( "/reset-password/:token",
    authValidation.tokenValidationSchema,
    authCTRL.getResetPassword );

// POST /reset-password
router.post( "/reset-password",
    authValidation.checkPasswordOnly,
    authCTRL.postResetPassword );

// GET /send-verification-email-view
router.get( "/send-verification-email-view",
    isAuth.isLoggedIn,
    authCTRL.getSendVerificationEmailView );

// GET /send-verification-email-action
router.get( "/send-verification-email-action",
    isAuth.isLoggedIn,
    authCTRL.getSendVerificationEmailAction );

module.exports = router;