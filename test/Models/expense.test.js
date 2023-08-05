const Expense = require( "../../model/expense.js" );

describe( "Testing The Expense Model CRUD Operations", () =>
{
    it( "Creating an expense and saving it to the database", async () =>
    {
        let testExpense = await Expense.create( {
            name: "myTestExpense",
            amount: 299.99,
            description: "test test test test",
            budgetId: null,
            categoryId:null
        } );
        let res = await testExpense.save();
        expect( res ).not.toBeNull();
        expect( res.amount ).toBe( 299.99 );
    } );

    it( "Reading an expense from the database", async () =>
    {
        let expense = await Expense.findOne( { where: { name: "myTestExpense" } } );
        expect( expense ).not.toBeNull();
        expect( expense.amount ).toBe( 299.99 );
    } );

    it( "Updating an expense in the database", async () =>
    {
        let res = await Expense.update( { amount: 599.56 }, { where: { name: "myTestExpense" } } );
        expect( res ).toBeTruthy();
    } );

    it( "Deleting an expense from the database", async () =>
    {
        let res = await Expense.destroy( { where: { name: "myTestExpense" } } );
        expect( res ).toBeTruthy();
    } );
} );