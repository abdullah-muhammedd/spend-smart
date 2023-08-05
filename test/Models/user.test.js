const User = require( "../../model/user" );
const { Op } = require( "sequelize" );

describe( "Testing The User Model CRUD Operations", () =>
{
    it( "Creating a user and saving it to the database", async () =>
    {
        let testUser = await User.create( {
            firstName: "John",
            lastName: "Doe",
            email: "test.john.Doe@test.com",
            password: "StrongPassword123@"
        } );
        let res = await testUser.save(); 
        expect( res ).not.toBeNull();
        expect( res.email ).toBe("test.john.Doe@test.com");
    } );

    it( "Reading user data from the database", async () =>
    {
        let user = await User.findOne( { where: { [ Op.and ]: [ { firstName: "John" }, { email: "test.john.Doe@test.com" } ] } } );
        expect(user).not.toBeNull();
        expect( user.email ).toBe("test.john.Doe@test.com");
    } );

    it( "Updating the user data in the database", async () =>
    {
        let res = await User.update( { lastName: "testUpdate" }, { where: { firstName: "John" } } );
        expect( res ).toBeTruthy();
    } );

    it( "Deleting user from the database", async () =>
    {
        let res = await User.destroy( { where: { firstName: "John" } } )  
        expect( res ).toBeTruthy();
    } );
} );