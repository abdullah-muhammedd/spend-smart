const { checkSchema } = require( 'express-validator' );
const bcrypt = require( 'bcryptjs' );
const dbContext = require( '../../model/dbContext' );

const userCheckValidationSchema = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    userEmail: {
        isEmail: {
            errorMessage: 'Invalid Email',
        },
        custom: {
            options: async ( value ) =>
            {
                const user = await dbContext.findUserInDbByEmail( value );
                if ( !user )
                {
                    throw new Error( 'E-mail Is Not Signed Up' );
                }
                return true;
            },
        },
    },
    userPassword: {
        custom: {
            options: async ( value, { req } ) =>
            {
                const user = await dbContext.findUserInDbByEmail( req.body.userEmail );
                if ( !bcrypt.compareSync( value, user.password ) )
                {
                    throw new Error( 'Password Is Wrong' );
                }
                return true;
            },
        },
    },
} );

const userCreationValidationSchema = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    userEmail: {
        isEmail: {
            errorMessage: 'Invalid Email',
        },
        custom: {
            options: async ( value ) =>
            {
                const user = await dbContext.findUserInDbByEmail( value );
                if ( user )
                {
                    throw new Error( 'E-mail Already In Use' );
                }
                return true;
            },
        },
    },
    userPassword: {
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
                returnScore: false,
            },
            errorMessage:
                'Password Must Be At Least 8 Characters Long And Contain At Least One Lowercase, One Uppercas, And One Number',
        }
    },
    userCpassword: {
        custom: {
            options: ( value, { req } ) =>
            {
                return value === req.body.userPassword;
            },
            errorMessage: 'Password and confirm password are different'
        }
    },
} );

const tokenValidationSchema = checkSchema( {
    'token': {
        in: [ "params" ],
        trim: true,
        notEmpty: {
            errorMessage: 'Token Is Not Vallid',
        }
    },
} );

const checkEmailOnly = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    userEmail: {
        isEmail: {
            errorMessage: 'Invalid Email',
        },
        custom: {
            options: async ( value ) =>
            {
                const user = await dbContext.findUserInDbByEmail( value );
                if ( !user )
                {
                    throw new Error( 'E-mail Is Not Signed Up' );
                }
                return true;
            },
        },
    },
} );
const checkPasswordOnly = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },

    userPassword: {
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
                returnScore: false,
            },
            errorMessage:
                'Password Must Be At Least 8 Characters Long And Contain At Least One Lowercase, One Uppercas, And One Number',
        }
    },
} );
module.exports = {
    userCheckValidationSchema,
    userCreationValidationSchema,
    tokenValidationSchema,
    checkEmailOnly,
    checkPasswordOnly
};
