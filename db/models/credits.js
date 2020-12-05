const {  DataTypes } = require('sequelize');

const model = {
    storeId : {
        type: DataTypes.INTEGER ,
        allowNull: false ,
        primaryKey: true
    },
    credits : {
        type: DataTypes.BIGINT  ,
        allowNull: false,
        defaultValue: 0
    }
}

const options = {
    timestamps: false
}

module.exports = {model, options};