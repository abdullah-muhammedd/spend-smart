const Category = require( '../../model/category.js' );

describe( "Testing The Category Model CRUD Operations", () =>
{
    it( "Creating a category and saving it to the database", async () =>
    {
        let testCategory = await Category.create( {
            name: "myTestCategory",
            description: "test test test test"
        } );
        let res = await testCategory.save();
        expect( res ).not.toBeNull();
    } );

    it( "Reading a category from the database", async () =>
    {
        let testCategory = await Category.findOne( { where: { name: "myTestCategory" } } );
        expect( testCategory ).not.toBeNull();
    } );

    it( "Updating a category in the database", async () =>
    {
        let res = await Category.update( { description: "Updated description" }, { where: { name: "myTestCategory" } } );
        expect( res ).toBeTruthy();
    } );

    it( "Deleting a category from the database", async () =>
    {
        let res = await Category.destroy( { where: { name: "myTestCategory" } } );
        expect( res ).toBeTruthy();
    } );
} );
