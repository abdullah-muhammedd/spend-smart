const { Sequelize, DataTypes, Model } = require( 'sequelize' );
const dbClient = require( "../utility/dbClient" );

class Budget extends Model { }
Budget.init( {
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
    goal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize: dbClient,
    modelName: "budget"
} );

module.exports = Budget;