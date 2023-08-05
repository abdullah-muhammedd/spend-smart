exports.commonData = function ( req, res, next )
{
    res.locals.responseData = {
        isLoggedIn: req.session.LOGGED_IN || null,
        error: null,
        cahedBodyData: null
    };
    next();
};
