const { checkSchema } = require( 'express-validator' );
const dbContext = require( '../../model/dbContext' );

const budgetValidatoinSchema = checkSchema( {
    '*': {
        in: [ "body" ],
        trim: true,
        notEmpty: {
            errorMessage: 'All Fields Are Required',
        },
    },
    budgetAmount: {
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
    budgetGoal: {
        custom: {
            options: ( value  , {req}) =>
            {
                if ( value < 0 || value < +req.body.budgetAmount)
                {
                    throw new Error( 'Goal Must Be Positive And Bigger Than Amount' );
                }
                return true;
            },
        },
    },
} );

const budgetExistanceValidationSchema = checkSchema( {
    id: {
        in: [ "params" ],
        notEmpty: {
            errorMessage: "Url Not Valid"
        },
        custom: {
            options: async ( value, { req } ) =>
            {
                const budgetId = value;
                const targetedBudget = await dbContext.findBudgetInDp( budgetId );
                if ( !targetedBudget )
                {
                    throw new Error( "Budget not found" );
                }
                if ( targetedBudget.userId != req.session.USER.dataValues.id )
                {
                    throw new Error( "Permission denied" );
                }

                return true;
            }
        }
    }
} );

module.exports = {
    budgetValidatoinSchema,
    budgetExistanceValidationSchema
};