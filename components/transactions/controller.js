const rfr = require('rfr');
const models = rfr('db/models').models;

const transactionHistory = async (req, res, next) => {
    try {
        const { storeInfo, userInfo } = req.query;
        const whereClause = {};
        if (storeInfo && storeInfo.id) whereClause.storeId = storeInfo.id;
        if (userInfo && userInfo.id) whereClause.userId = userInfo.id;
        const query = { order: [['transaction_date', 'DESC']] };
        if (Object.entries(whereClause).length) query.where = whereClause;
        const foundTransactions = await models.transaction.findAll(query);
        return res.send({
            history: foundTransactions
        })
    } catch (error) {
        next(error)
    }

}

module.exports = { transactionHistory }