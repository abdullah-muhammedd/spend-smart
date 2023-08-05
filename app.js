//* Global
const path = require( 'path' );

//* 3RD Party
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const session = require( 'express-session' );
const connectSession = require( 'connect-session-sequelize' )( session.Store );
const flash = require( 'express-flash' );
const cookieParser = require( 'cookie-parser' );
const csurf = require( 'csurf' );
require( 'dotenv' ).config();

//* Local
const dbClient = require( "./utility/dbClient.js" );

const dbContext = require( "./model/dbContext" );

const commonData = require( "./middlewares/commonData.js" );

const authRouter = require( "./router/auth.js" );
const mainRouter = require( "./router/main.js" );
const incomeRouter = require( "./router/income.js" );
const expenseRouter = require( "./router/expense.js" );
const categoryRouter = require( "./router/category.js" );
const budgetRouter = require( "./router/budget.js" );
const errorCTRL = require( "./controller/error" );


const app = express();

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );

app.use( express.static( path.join( __dirname, 'public' ) ) );

let store = new connectSession( { db: dbClient } );
app.use( session( {
    name: 'SpendSmartCookie',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
} ) );

app.use( flash() );

app.use( csurf() );

app.set( 'view engine', 'ejs' );

// * Register routes
app.use( commonData.commonData );
app.use( authRouter );
app.use( mainRouter );
app.use( incomeRouter );
app.use( expenseRouter );
app.use( categoryRouter );
app.use( budgetRouter );
app.use( errorCTRL.get404 );
app.use( errorCTRL.getError );

// * Associations/Relations
dbContext.createAssosiations();


dbClient.sync()
    .then( () =>
    {
        const PORT = process.env.PORT ?? 3000;
        app.listen( PORT );
    } )
    .catch( err =>
    {
        if ( err )
        {
            console.log( err );
            process.exit();
        }
    } );
