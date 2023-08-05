const { checkSchema } = require( 'express-validator' );
const dbContext = require( '../../model/dbContext' );

const categoryExistanceValidationSchema = checkSchema( {
    id: {
        in: [ "params" ],
        notEmpty: {
            errorMessage: "Url Not Valid"
        },
        custom: {
            options: async ( value, { req } ) =>
            {
                const categoryId = value;
                const targetedCategory = await dbContext.findCategoryInDp( categoryId );
                if ( !targetedCategory )
                {
                    throw new Error( "Category not found" );
                }
                if ( targetedCategory.userId != req.session.USER.dataValues.id )
                {
                    throw new Error( "Permission denied" );
                }

                return true;
            }
        }
    }
} );

module.exports = {
    categoryExistanceValidationSchema
};