
exports.getError = function ( err, req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/nothing";
    responseData.docTitle = "Error";
    responseData.error = err.message;
    
    if ( err.message === "Permission denied" )
    { 
        return res.status( 403 ).render( "./Error/error", responseData );
    }
    return res.status( 500 ).render( "./Error/error", responseData );
};

exports.get404 = function ( req, res, next )
{
    const responseData = res.locals.responseData;
    responseData.path = "/none";
    responseData.docTitle = "Error";
    return res.status( 404 ).render( "./Error/404", responseData );
};

