const {  DataTypes } = require('sequelize');

const model = {
    id : {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true, 
        unique: true,
        allowNull: false 
    },
    email : {
        type: DataTypes.STRING(64) ,
        allowNull: false , 
        unique: true
    },
    password : {
        type: DataTypes.STRING(32)  ,
        allowNull: false
    }
}

const options = {
    timestamps: false
}

module.exports = {model, options};