const { Sequelize } = require( 'sequelize' );
require( 'dotenv' ).config();
/**
 * @description Create the sequelize connection pool
 */

const dbClient = new Sequelize( {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: "mysql",
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
} );
module.exports = dbClient;
