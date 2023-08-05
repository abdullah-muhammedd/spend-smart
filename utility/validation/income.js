const { checkSchema } = require( 'express-validator' );
const dbContext = require( '../../model/dbContext' );

const incomeValidationSchema = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    incomeAmount: {
        custom: {
            options: ( value ) =>
            {
                if ( value < 0 )
                {
                    throw new Error( 'Amount Must Be Positive' );
                }
                return true;
            },
        },
    },
    incomeBudgetId: {
        custom: {
            options: ( value ) =>
            {
                if ( value === "null" )
                {
                    throw new Error( "You Must Choose A Budget" );
                }
                return true;
            }
        }
    },
    incomeCategoryId: {
        custom: {
            options: ( value ) =>
            {
                if ( value === "null" )
                {
                    throw new Error( "You Must Choose A Category" );
                }
                return true;
            }
        }
    },

} );

const incomeExistanceValidationSchema = checkSchema( {
    id: {
        in: [ "params" ],
        notEmpty: {
            errorMessage: "Url Not Valid"
        },
        custom: {
            options: async ( value, { req } ) =>
            {
                const incomeId = value;
                const targetedIncome = await dbContext.findIncomeInDb( incomeId );
                if ( !targetedIncome )
                {
                    throw new Error( "Income not found" );
                }
                if ( targetedIncome.userId != req.session.USER.dataValues.id )
                {
                    throw new Error( "Permission denied" );
                }

                return true;
            }
        }
    }
} );

module.exports = {
    incomeValidationSchema,
    incomeExistanceValidationSchema
};