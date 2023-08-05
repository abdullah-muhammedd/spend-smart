const { Sequelize, DataTypes, Model } = require( 'sequelize' );
const dbClient = require( "../utility/dbClient" );

class Income extends Model { }
Income.init( {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: dbClient,
    modelName: "income"
} );

module.exports = Income;