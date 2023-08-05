const crypto = require( "crypto" );
/**
 * @description Create 32 byte token that uniquely identify the user 
 * @descreption during sensetive processes like resetting password and saving user data and verifying them
 */

exports.generateToken = function ()
{
    return new Promise( ( resolve, reject ) =>
    {
        crypto.randomBytes( 32, ( err, buf ) =>
        {
            if ( err )
            {
                return reject( err );
            }
            else
            {
                const result = buf.toString( 'hex' );
                return resolve( result );
            }
        } );
    } );
};