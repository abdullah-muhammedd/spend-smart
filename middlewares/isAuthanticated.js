exports.isLoggedIn = function ( req, res, next )
{ 
    if ( !req.session.LOGGED_IN )
    { 
        return res.redirect( "/login" );
    }
    next();
};

exports.isVerified = function ( req, res, next )
{
    if ( !req.session.VERIFIED )
    {
        return res.redirect( "/send-verification-email-view" );
    }
    next();
};

exports.isNotLoggedIn = function ( req, res, next )
{
    if ( req.session.LOGGED_IN )
    {
        return res.redirect( "/" );
    }
    next();
};