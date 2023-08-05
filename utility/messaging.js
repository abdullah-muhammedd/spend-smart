/**
 * @description Handling saving data to flash asynchrounesly due to the storage problem
 * @param {httpRequestObject : req} 
 * @param {any} message
 */
exports.passObject = function ( req, message )
{
    return new Promise( ( resolve, reject ) =>
    {
        req.flash( 'Object', message );
        req.session.save( ( err ) =>
        {
            if ( err )
            {
                reject( err );
            }
            else
            {
                resolve();
            }
        } );
    } );
};