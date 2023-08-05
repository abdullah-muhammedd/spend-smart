const { checkSchema } = require( 'express-validator' );
const dbContext = require( '../../model/dbContext' );

const expenseValidationSchema = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    expenseAmount: {
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
    expenseBudgetId: {
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
    expenseCategoryId: {
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

const expenseExistanceValidationSchema = checkSchema( {
    id: {
        in: [ "params" ],
        notEmpty: {
            errorMessage: "Url Not Valid"
        },
        custom: {
            options: async ( value, { req } ) =>
            {
                const expenseId = value;
                const targetedExpense = await dbContext.findExpenseInDb( expenseId );
                if ( !targetedExpense )
                {
                    throw new Error( "Expense not found" );
                }
                if ( targetedExpense.userId != req.session.USER.dataValues.id )
                {
                    throw new Error( "Permission denied" );
                }

                return true;
            }
        }
    }
} );

module.exports = {
    expenseValidationSchema,
    expenseExistanceValidationSchema
};