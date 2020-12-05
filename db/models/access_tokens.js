const {  DataTypes, Sequelize } = require('sequelize');

const model = {
    token : {
        type: DataTypes.STRING(64) ,
        primaryKey: true, 
        allowNull: false , 
        unique: true
    },
    userId : {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    creation_date : {
        type: DataTypes.DATE  ,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}

const options = {
    timestamps: false
}

module.exports = {model, options};