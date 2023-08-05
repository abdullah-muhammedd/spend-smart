const { Sequelize, DataTypes, Model } = require( 'sequelize' );
const dbClient = require( "../utility/dbClient" );

class User extends Model { };
User.init( {
    //? Attributes
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    //? Meta Data
    meta_isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    meta_verificationToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    meta_verificationTokenExpiration: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    meta_isResetting: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    meta_resettingToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    meta_resettingTokenExpiration: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
}, {
    sequelize: dbClient,
    modelName: "user"
} );

module.exports = User;