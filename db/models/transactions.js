const {  DataTypes, Sequelize } = require('sequelize');

const model = {
    id : {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true, 
        unique: true, 
        allowNull: false 
    },
    type : {
        type: DataTypes.INTEGER ,
        allowNull: false 
    },
    amount : {
        type: DataTypes.BIGINT ,
        allowNull: false 
    },
    userId : {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    storeId : {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    transaction_date : {
        type: DataTypes.DATE  ,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}

const options = {
    timestamps: false
}

module.exports = {model, options};