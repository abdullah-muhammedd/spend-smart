const { Sequelize, DataTypes, Model } = require( 'sequelize' );
const dbClient = require( "../utility/dbClient" );


class Category extends Model { }
Category.init( {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: dbClient,
    modelName: "category"
} );
module.exports = Category;