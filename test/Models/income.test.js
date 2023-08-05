const Income = require( "../../model/income.js" );

describe( "Testing The Income Model CRUD Operations", () =>
{
    it( "Creating an income and saving it to the database", async () =>
    {
        let testIncome = await Income.create( {
            name: "myTestIncome",
            amount: 299.99,
            description: "test test test test",
            budgetId: null,
            categoryId: null
            
        } );
        let res = await testIncome.save();
        expect( res ).not.toBeNull();
        expect( res.amount ).toBe( 299.99 );
    } );

    it( "Reading an income from the database", async () =>
    {
        let income = await Income.findOne( { where: { name:"myTestIncome" } } );
        expect( income ).not.toBeNull();
        expect( income.amount ).toBe( 299.99 );
    } );

    it( "Updating an income in the database ", async () =>
    {
        let res = await Income.update( {amount : 599.56}, { where: { name: "myTestIncome" } } );
        expect( res ).toBeTruthy();
    } );

    it( "Deleting an income from the database", async () =>
    {
        let res = await Income.destroy( { where: { name: "myTestIncome" } } );
        expect( res ).toBeTruthy();
    } );
} );
