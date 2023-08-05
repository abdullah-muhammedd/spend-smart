const { validationResult } = require( "express-validator" );

const dbContext = require( '../model/dbContext' );
const mailsUtil = require( '../utility/mails' );
const tokensUtil = require( '../utility/tokens' );
const messagingUtil = require( '../utility/messaging' );
const encryptionUtil = require( '../utility/encryption' );
const errorsType = require( "../utility/errorsType" );



exports.getSignup = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/signup";
    responseData.docTitle = "Signup";
    return res.render( "./Auth/signup", responseData );
};

exports.postSignup = async function ( req, res, next )
{
    const userFname = req.body.userFname;
    const userLname = req.body.userLname;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    //* Handle validation results 
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        const responseData = res.locals.responseData;
        responseData.path = "/signup";
        responseData.docTitle = "Signup";
        responseData.error = errors.array()[ 0 ].msg;
        return res.render( "./Auth/signup", responseData );
    };

    //* Generating verification Token
    const token = await tokensUtil.generateToken()
        .catch( () => { return next( new Error( errorsType.AUTH_ERROR_TOKEN + "SIUP" ) ); } );

    //* Encrypt Password 
    const hashed = await encryptionUtil.encryptPassword( userPassword )
        .catch( () => { return next( new Error( errorsType.AUTH_ERROR_ENCRYPTION + "ENCRP - SIUP" ) ); } );

    //* Save User Data
    await dbContext.addUserToDb( userFname, userLname, userEmail, hashed, token )
        .catch( () => { return next( new Error( errorsType.DB_ERROR_CREATE + "ENCRP - SIUP" ) ); } );

    //* Send Verification Email => async
    mailsUtil.sendVerificationMail( userEmail, token );

    return res.redirect( "/verification-email-sent" );
};

exports.getVerificationEmailSent = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/signup";
    responseData.docTitle = "Your Email Sent";
    return res.render( "./Auth/verification-email-sent", responseData );
};

exports.getVerifyEmail = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errorsType.AUTH_ERROR_TOKEN, "REST_PASS" ) );
    };

    const token = req.params.token;
    //* Get the user 
    const user = await dbContext.findUserInDbByVerificationToken( token )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "VER$MAIL" ) );
        } );

    //* Get and validate token expiration
    if ( !user )
    {
        return next( new Error( errorsType.AUTH_ERROR_TOKEN + "VER$MAIL" ) );
    }
    const tokenExpiration = new Date( user.meta_verificationTokenExpiration );
    if ( isNaN( tokenExpiration ) || tokenExpiration < Date.now() )
    {
        return res.redirect( "/send-verification-email-view" );
    }

    //* Verify The Email
    await dbContext.verifyUserEmail( user )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_UPDATE + "VER$MAIL" ) );
        } );
    req.session.VERIFIED = req.session.VERIFIED === false ? true : null;

    return res.redirect( "/" );
};

exports.getLogin = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/login";
    responseData.docTitle = "Login";
    return res.render( "./Auth/login", responseData );
};

exports.postLogin = async function ( req, res, next )
{
    //* Handle validation results 
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        const responseData = res.locals.responseData;
        responseData.path = "/login";
        responseData.docTitle = "Login";
        responseData.error = errors.array()[ 0 ].msg;
        return res.render( "./Auth/login", responseData );
    };

    const userEmail = req.body.userEmail;
    //* Get the user 
    const user = await dbContext.findUserInDbByEmail( userEmail )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "LOG" ) );
        } );

    //* Update Session data
    const Verified = user.meta_isVerified;
    req.session.USER = { ...user };
    req.session.LOGGED_IN = true;
    req.session.VERIFIED = Verified;

    return res.redirect( "/" );
};

exports.getLogout = async function ( req, res, next )
{

    try
    {
        await new Promise( ( resolve, reject ) =>
        {
            req.session.destroy( ( err ) =>
            {
                if ( err ) { reject( err ); }
                else { resolve(); }
            } );
        } );
    }
    catch ( error )
    {
        return next( new Error( errorsType.SESSION_ERROR_DESTROY + "LOG_OUT" ) );
    }
    return res.redirect( "/login" );
};

exports.getAskToResetPassword = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/login";
    responseData.docTitle = "Ask To Reset Password";
    return res.render( "./Auth/ask-to-reset-password", responseData );
};

exports.postAskToResetPassword = async function ( req, res, next )
{
    //* Handle validation results 
    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        const responseData = res.locals.responseData;
        responseData.path = "/login";
        responseData.docTitle = "Ask To Reset Password";
        responseData.error = errors.array()[ 0 ].msg;
        return res.render( "./Auth/ask-to-reset-password", responseData );
    };

    const userEmail = req.body.userEmail;
    const user = await dbContext.findUserInDbByEmail( userEmail )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "ATRP" ) );
        } );

    //* Generate resetting token
    const token = await tokensUtil.generateToken()
        .catch( () =>
        {
            return next( new Error( errorsType.AUTH_ERROR_TOKEN + "ATRP" ) );
        } );

    //* Update Data
    await dbContext.setUserResettingToken( user, token );

    //* Send resetting emailail => async
    mailsUtil.sendResettingMail( userEmail, token );

    return res.redirect( "/resetting-email-sent" );
};

exports.getResettingEmailSent = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/login";
    responseData.docTitle = "Your Email Sent";
    return res.render( "./Auth/resetting-email-sent", responseData );
};

exports.getResetPassword = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errorsType.AUTH_ERROR_TOKEN, "REST_PASS" ) );
    };

    const token = req.params.token;
    const responseData = res.locals.responseData;
    responseData.path = "/login";
    responseData.docTitle = "Create New Password";
    responseData.token = token;
    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData.error = message[ 0 ].message;
    }
    return res.render( "./Auth/reset-password", responseData );
};

exports.postResetPassword = async function ( req, res, next )
{

    //* Handle validation results 
    const token = req.body.token;

    const errors = validationResult( req );
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req, { message: errors.array()[ 0 ].msg } );
        return res.redirect( `/reset-password/${ token }` );
    };

    const userPassword = req.body.userPassword;

    //* Find The User 
    const user = await dbContext.findUserInDbByResettingToken( token )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "REST_PASS" ) );
        } );

    //* Get and validate token expiration
    if ( !user )
    {
        return next( new Error( errorsType.AUTH_ERROR_TOKEN + "REST_PASS" ) );
    }
    const tokenExpiration = new Date( user.meta_resettingTokenExpiration );
    if ( isNaN( tokenExpiration ) || tokenExpiration < Date.now() )
    {
        return next( new Error( errorsType.AUTH_ERROR_PASSWORD + "REST_PASS" ) );
    }

    //* Encrypt Password 
    const hashed = await encryptionUtil.encryptPassword( userPassword );

    //* Update User Data
    await dbContext.updateUserPasswordInDb( user, hashed ).catch( () =>
    {
        return next( new Error( errorsType.DB_ERROR_UPDATE + "REST_PASS" ) );
    } );

    return res.redirect( "/login" );

};

exports.getSendVerificationEmailView = async function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/signup";
    responseData.docTitle = "Verify Email";
    res.render( "./Auth/send-verification-email", responseData );
};

exports.getSendVerificationEmailAction = async function ( req, res, next )
{
    //* Finding the user  
    const userId = req.session.USER.dataValues.id;
    const user = await dbContext.findUserInDb( userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "SVEA" ) );
        } );

    //* Generating verification Token
    const token = await tokensUtil.generateToken()
        .catch( () =>
        {
            return next( new Error( errorsType.AUTH_ERROR_TOKEN + "SVEA" ) );
        } );

    //* Update Data
    await dbContext.setUserVerifcationToken( user, token );

    //* Send Verification Email => async
    mailsUtil.sendVerificationMail( user.email, token );

    res.redirect( "/verification-email-sent" );
};