const User = require( "./user" );
const Expense = require( "./expense" );
const Income = require( "./income" );
const Budget = require( "./budget" );
const Category = require( "./category" );
const dbClient = require( "../utility/dbClient" );

// ──────────────────────────────────────────────────────────────────────────────────────────────
// GENERAL SECTION
// This section contains functions related to managing general asspects of the database.

exports.createAssosiations = function ()
{
    // Each User can have multiple Budgets
    User.hasMany( Budget, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Budget.belongsTo( User );

    // Each User can have multiple Categories
    User.hasMany( Category, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Category.belongsTo( User );

    // Each User can have multiple Incomes
    User.hasMany( Income, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Income.belongsTo( User );

    // Each User can have multiple Expenses
    User.hasMany( Expense, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Expense.belongsTo( User );

    // Each Budget can have multiple Incomes
    Budget.hasMany( Income, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Income.belongsTo( Budget );

    // Each Budget can have multiple Expenses
    Budget.hasMany( Expense, { onDelete: "CASCADE", onUpdate: "CASCADE" } );
    Expense.belongsTo( Budget );

    // Each Category can have multiple Incomes
    Category.hasMany( Income, { onDelete: "SET NULL", onUpdate: "CASCADE" } );
    Income.belongsTo( Category );

    // Each Category can have multiple Expenses
    Category.hasMany( Expense, { onDelete: "SET NULL", onUpdate: "CASCADE" } );
    Expense.belongsTo( Category );
};

exports.getChartData = async function ( userId )
{
    try
    {
        const options = { userId: userId };

        const [ Incomes, Expenses ] = await Promise.all( [
            Income.findAll( {
                where: options,
                attributes: [
                    [ dbClient.fn( 'sum', dbClient.col( 'amount' ) ), 'totalAmount' ],
                    [ dbClient.literal( 'DATE(createdAt)' ), 'createdDay' ] 
                ],
                order: [ [ dbClient.literal( 'DATE(createdAt)' ), 'ASC' ] ], 
                group: [ dbClient.literal( 'DATE(createdAt)' ) ], 
                limit: 7,
            } ),
            Expense.findAll( {
                where: options,
                attributes: [
                    [ dbClient.fn( 'sum', dbClient.col( 'amount' ) ), 'totalAmount' ],
                    [ dbClient.literal( 'DATE(createdAt)' ), 'createdDay' ] 
                ],
                order: [ [ dbClient.literal( 'DATE(createdAt)' ), 'ASC' ] ],
                group: [ dbClient.literal( 'DATE(createdAt)' ) ], 
                limit: 7,
            } ),
        ] );
        return {
            incomes: Incomes,
            expenses: Expenses
        };
    } catch ( error )
    {
        console.log( error );
        throw new Error();
    }
};
// ──────────────────────────────────────────────────────────────────────────────────────────────
// BUDGETS SECTION
// This section contains functions related to managing budgets in the database.

exports.getBudgetsFromDb = async function ( userId, opt = {}, limit = Number.MAX_SAFE_INTEGER, offset = 0 )
{
    try
    {
        let options = { ...opt };
        options.userId = userId;
        const Budgets = await Budget.findAll( {
            where: options,
            order: [ [ "updatedAt", "DESC" ] ],
            limit: limit,
            offset: offset
        } );
        return Budgets;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.findBudgetInDp = async function ( pk )
{
    try
    {
        const targetedBudget = await Budget.findByPk( pk );
        return targetedBudget;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.addBudgetToDb = async function ( name, amount, goal, description, active, userId )
{
    try
    {
        await Budget.create(
            {
                name,
                amount,
                goal,
                description,
                active,
                userId,
            } );
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.updateBudgetInDp = async function ( pk, name, amount, goal, description )
{
    try 
    {
        await Budget.update(
            {
                name,
                amount,
                goal,
                description,
            },
            {
                where:
                {
                    id: pk
                }
            }
        );
    }
    catch ( error )
    {
        console.log( error );
        throw new Error( error );
    }
};

exports.deleteBudgetFromDb = async function ( pk )
{
    try 
    {
        await Budget.destroy( {
            where:
            {
                id: pk
            }
        } );
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.activateBudgetInDb = async function ( pk )
{
    try 
    {
        const targetedBudget = await Budget.findByPk( pk );

        if ( Boolean( targetedBudget.active ) === true )
        {
            targetedBudget.active = false;
        }
        else
        {
            targetedBudget.active = true;
        }

        await targetedBudget.save();
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

// ──────────────────────────────────────────────────────────────────────────────────────────────
// CATEGORIES SECTION
// This section contains functions related to managing categories in the database.

exports.getCategoriesFromDb = async function ( userId, opt = {}, limit = Number.MAX_SAFE_INTEGER, offset = 0 )
{
    try
    {
        let options = { ...opt };
        options.userId = userId;
        const Categories = await Category.findAll( {
            where: options,
            order: [ [ "updatedAt", "DESC" ] ],
            limit: limit,
            offset: offset
        } );
        return Categories;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.findCategoryInDp = async function ( pk )
{
    try
    {
        const targetedCategory = await Category.findByPk( pk );
        return targetedCategory;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.addCategoryToDb = async function ( name, description, userId )
{
    try
    {
        await Category.create( {
            name,
            description,
            userId
        } );
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.updateCategoryInDp = async function ( pk, name, description )
{
    try 
    {
        await Category.update(
            {
                name,
                description
            },
            {
                where:
                {
                    id: pk
                }
            }
        );
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.deleteCategoryFromDb = async function ( pk )
{
    await Category.destroy( { where: { id: pk } } );
};

// ──────────────────────────────────────────────────────────────────────────────────────────────
// INCOMES SECTION
// This section contains functions related to managing incomes in the database.

exports.getIncomesFromDb = async function ( userId, opt = {}, include = [], limit = Number.MAX_SAFE_INTEGER, offset = 0 )
{
    try
    {
        let options = { ...opt };
        options.userId = userId;
        const Incomes = await Income.findAll( {
            where: options,
            order: [ [ "updatedAt", "DESC" ] ],
            limit: limit,
            offset: offset,
            include: include
        } );
        return Incomes;
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.findIncomeInDb = async function ( pk )
{
    try
    {
        const targetedIncome = await Income.findByPk( pk );
        return targetedIncome;
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.addIncomeToDb = async function ( name, amount, description, budgetId, categoryId, userId )
{
    try
    {
        const budget = await Budget.findByPk( budgetId );
        //* Update the related budget 
        budget.amount += +amount;
        await budget.save();

        await Income.create( {
            name,
            amount,
            description,
            budgetId,
            categoryId: +categoryId,
            userId,
        } );
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.updateIncomeInDp = async function ( pk, name, amount, description, budgetId, categoryId )
{
    try 
    {
        const income = await Income.findByPk( pk );

        //* Update the budget that was related with this income 
        const oldBudget = await Budget.findByPk( income.budgetId );
        oldBudget.amount -= +income.amount;
        await oldBudget.save();

        let newBudget = oldBudget;

        //* Check if the budget changed get the new one to update it 
        if ( oldBudget.id !== +budgetId )
        {
            newBudget = await Budget.findByPk( budgetId );
        }

        //* Save the changes in amount
        newBudget.amount += +amount;
        await newBudget.save();


        income.name = name;
        income.amount = amount;
        income.description = description;
        income.budgetId = budgetId;
        income.categoryId = +categoryId;

        await income.save();
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.deleteIncomeFromDp = async function ( pk )
{
    try
    {
        const income = await Income.findByPk( pk );

        //* Update The Related Budget Before Deletion
        const oldBudget = await Budget.findByPk( income.budgetId );
        oldBudget.amount -= +income.amount;
        await oldBudget.save();

        await Income.destroy( { where: { id: pk } } );
    }
    catch ( error )
    {
        throw new Error();
    }
};


// ──────────────────────────────────────────────────────────────────────────────────────────────
// EXPENSES SECTION
// This section contains functions related to managing expenses in the database.es 

exports.getExpensesFromDb = async function ( userId, opt = {}, include = [], limit = Number.MAX_SAFE_INTEGER, offset = 0 )
{
    try
    {
        let options = { ...opt };
        options.userId = userId;
        const Expenses = await Expense.findAll( {
            where: options,
            order: [ [ "updatedAt", "DESC" ] ],
            limit: limit,
            offset: offset,
            include: include
        } );
        return Expenses;
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.findExpenseInDb = async function ( pk )
{
    try
    {
        const targetedExpense = await Expense.findByPk( pk );
        return targetedExpense;
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.addExpenseToDb = async function ( name, amount, description, budgetId, categoryId, userId )
{
    try
    {
        const budget = await Budget.findByPk( budgetId );
        //* Update the related budget 
        budget.amount -= +amount;
        await budget.save();

        await Expense.create( {
            name,
            amount,
            description,
            budgetId,
            categoryId: +categoryId,
            userId,
        } );
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.updateExpenseInDp = async function ( pk, name, amount, description, budgetId, categoryId )
{
    try 
    {
        const expense = await Expense.findByPk( pk );

        //* Update the budget that was related with this income 
        const oldBudget = await Budget.findByPk( expense.budgetId );
        oldBudget.amount += +expense.amount;
        await oldBudget.save();

        let newBudget = oldBudget;

        //* Check if the budget changed get the new one to update it 
        if ( oldBudget.id !== +budgetId )
        {
            newBudget = await Budget.findByPk( budgetId );
        }

        //* Save the changes in amount
        newBudget.amount -= +amount;
        await newBudget.save();


        expense.name = name;
        expense.amount = amount;
        expense.description = description;
        expense.budgetId = budgetId;
        expense.categoryId = +categoryId;

        await expense.save();
    }
    catch ( error )
    {
        throw new Error();
    }
};

exports.deleteExpenseFromDp = async function ( pk )
{
    try
    {
        const expense = await Expense.findByPk( pk );

        //* Update The Related Budget Before Deletion
        const oldBudget = await Budget.findByPk( expense.budgetId );
        oldBudget.amount += +expense.amount;
        await oldBudget.save();

        await Expense.destroy( { where: { id: pk } } );
    }
    catch ( error )
    {
        throw new Error( error );
    }
};


// ──────────────────────────────────────────────────────────────────────────────────────────────
// USER SECTION
// This section contains functions related to managing users in the database.

exports.addUserToDb = async function ( userFname, userLname, userEmail, hashed, token, meta_verificationTokenExpiration = new Date( Date.now() + ( 3 * 60 * 60 * 1000 ) ) )
{
    await User.create( {
        firstName: userFname,
        lastName: userLname,
        email: userEmail,
        password: hashed,
        meta_verificationToken: token,
        meta_verificationTokenExpiration: new Date( Date.now() + ( 3 * 60 * 60 * 1000 ) )
    } )
        .catch( ( error ) =>
        {
            throw new Error( error );
        } );
};

exports.findUserInDb = async function ( pk )
{
    try
    {
        const user = await User.findByPk( pk );
        return user;
    } catch ( error )
    {
        throw new Error( error );
    }
};

exports.findUserInDbByEmail = async function ( email )
{
    try
    {
        const user = await User.findOne( { where: { email: email } } );
        return user;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.findUserInDbByVerificationToken = async function ( token )
{
    try
    {
        const user = await User.findOne( { where: { meta_verificationToken: token } } );
        return user;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.findUserInDbByResettingToken = async function ( token )
{
    try
    {
        const user = await User.findOne( { where: { meta_resettingToken: token } } );
        return user;
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.setUserVerifcationToken = async function ( user, token )
{
    try
    {
        user.meta_verificationToken = token;
        user.meta_verificationTokenExpiration = new Date( Date.now() + ( 3 * 60 * 60 * 1000 ) );
        await user.save();
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.verifyUserEmail = async function ( user )
{
    try
    {
        user.meta_isVerified = true;
        user.meta_verificationToken = null;
        user.meta_verificationTokenExpiration = null;
        await user.save();
    }
    catch ( error )
    {
        throw new Error( error );
    }
};

exports.setUserResettingToken = async function ( user, token )
{
    try
    {
        user.meta_isResetting = true;
        user.meta_resettingToken = token;
        user.meta_resettingTokenExpiration = new Date( Date.now() + ( 3 * 60 * 60 * 1000 ) );
        await user.save();
    }
    catch ( error )
    {
        throw new Error( error );
    };
};

exports.updateUserPasswordInDb = async function ( user, password )
{
    try
    {
        user.meta_isResetting = false;
        user.meta_resettingToken = null;
        user.meta_resettingTokenExpiration = null;
        user.password = password;
        await user.save();
    }
    catch ( error )
    {
        throw new Error( error );
    };
}; 