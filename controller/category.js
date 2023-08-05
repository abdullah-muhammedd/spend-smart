const { validationResult } = require( "express-validator" );

const filtersUtil = require( "../utility/filters" );
const dbContext = require( "../model/dbContext" );
const errorsType = require( "../utility/errorsType" );
const messagingUtil = require( '../utility/messaging' );

exports.getCategories = async function ( req, res, next )
{
    const userId = req.session.USER.dataValues.id;

    const Categories = await dbContext.getCategoriesFromDb( userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "CAT" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/categories";
    responseData.docTitle = "Categories";
    responseData.categories = Categories;
    return res.render( "./Category/categories", responseData );
};

exports.getAddCategories = async function ( req, res, next )
{

    const responseData = res.locals.responseData;
    responseData.path = "/categories";
    responseData.docTitle = "Add Category";

    return res.render( "./Category/add-category", responseData );
};

exports.postAddCategories = async function ( req, res, next )
{
    const name = req.body.categoryName;
    const description = req.body.categoryDescription;
    const userId = req.session.USER.dataValues.id;
    await dbContext.addCategoryToDb( name, description, userId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_CREATE + "CAT" ) );
        } );
    return res.redirect( "/categories" );
};

exports.getEditCategories = async function ( req, res, next )
{
    const categoryId = req.params.id;
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const targetedCategory = await dbContext.findCategoryInDp( categoryId )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_SELECT + "CAT" ) );
        } );

    const responseData = res.locals.responseData;
    responseData.path = "/categories";
    responseData.docTitle = "Edit Category";
    responseData.category = targetedCategory;

    let message = await req.flash( 'Object' );
    if ( message.length > 0 )
    {
        responseData, message[ 0 ].message;
    }

    return res.render( "./Category/edit-category", responseData );
};

exports.postEditCategories = async function ( req, res, next )
{
    const categoryId = req.body.categoryId;

    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        await messagingUtil.passObject( req, { message: errors.array()[ 0 ].msg } );
        return res.redirect( `/edit-categories${ categoryId }` );
    };

    const name = req.body.categoryName;
    const description = req.body.categoryDescription;

    await dbContext.updateCategoryInDp( categoryId, name, description )
        .catch( () =>
        {
            return next( new Error( errorsType.DB_ERROR_UPDATE + "CAT" ) );
        } );

    return res.redirect( "/categories" );
};

exports.getDeleteCategories = async function ( req, res, next )
{
    const errors = validationResult( req );
    //* Handle Validation
    if ( !errors.isEmpty() )
    {
        return next( new Error( errors.array()[ 0 ].msg ) );
    };

    const categoryId = req.params.id;

    await dbContext.deleteCategoryFromDb( categoryId );

    return res.redirect( "/categories" );
};

exports.postFilterCategories = async function ( req, res, next )
{
    const requestDateFilter = req.body.dateFilter;
    const userId = req.session.USER.dataValues.id;

    //* If no date filter provided, redirect to the categories page
    if ( !requestDateFilter )
    {
        return res.redirect( "/categories" );
    }

    let options = filtersUtil.getOptionsObject( requestDateFilter, null, null );

    const Categories = await dbContext.getCategoriesFromDb( userId, options );

    const responseData = {
        ...res.locals.responseData,
        path: "/categories",
        docTitle: "Category",
        categories: Categories,
    };

    return res.render( "./Category/categories", responseData );
};