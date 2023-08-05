const bcrypt = require( "bcryptjs" );
const AUTH_ERROR_ENCRYPTION = `AUTH_ENCRYPTION_ERROR CODE:`;
/**
 * @description Encrypt password and return the encrypted one 
 * @param {any : password} 
 * @returns {any : hashed password } 
 */

exports.encryptPassword = async function ( password )
{
    try
    {
        //* Encrypt Password 
        const salt = await bcrypt.genSalt( 10 );
        const hashed = await bcrypt.hash( password, salt );
        return hashed;
    }
    catch ( err )
    {
        throw new Error();
    }
};