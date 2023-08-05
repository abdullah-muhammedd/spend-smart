const Budget = require( "../../model/budget.js" );

describe( "Testing The Budget Model CRUD Operations", () =>
{
    it( "Creating a budget and save it to the database", async () =>
    {
        let testBudget = await Budget.create( {
            name: "myTestBudget",
            amount: 5000.55,
            goal: 10000.56,
            description: "test test test test",
            active: true,
            userId:null
        } );
        let res = await testBudget.save();
        expect( res ).not.toBeNull();
        expect( res.goal ).toBe( 10000.56 );
    } );

    it( "Reading a budget from the database", async () =>
    {
        let testBudget = await Budget.findOne( { where: { name: "myTestBudget" } } );
        expect( testBudget ).not.toBeNull();
        expect( testBudget.amount ).toBe( 5000.55 );
    } );

    it( "Updating a budget in the database", async () =>
    {
        let res = await Budget.update( { description: "Updated description" }, { where: { name: "myTestBudget" } } );
        expect( res ).toBeTruthy();
    } );

    it( "Deleting a budget from the database", async () =>
    {
        let res = await Budget.destroy( { where: { name: "myTestBudget" } } );
        expect( res ).toBeTruthy();
    } );
} );