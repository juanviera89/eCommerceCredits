const rfr = require('rfr');
const models = rfr('db/models').models;

const transactionHistory = async (req, res, next) => {
    try {
        const { storeInfo, userInfo } = req.query;
        const whereClause = {};
        if (storeInfo && storeInfo.id) whereClause.storeId = storeInfo.id;
        if (userInfo && userInfo.id) whereClause.userId = userInfo.id;
        const query = Object.entries(whereClause).length ? { where : whereClause} : {}
        const foundTransactions = await models.transaction.findAll(query);
        return res.send({
            history: foundTransactions
        })
    } catch (error) {
        ['development', 'test'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('log') ? console.error(error) : null
        return res.status(500).send({ message: 'Unespected server error' })
    }

}

module.exports = {transactionHistory}