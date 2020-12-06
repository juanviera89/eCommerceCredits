const rfr = require('rfr');
const models = rfr('db/models').models;

const storeCredits = async (req, res, next) => {
    try {
        const { store } = req.query;
        const foundCredits = await models.store.findOne({ attributes: ['credit.credits'], where: { name: decodeURIComponent(store) }, include: { model: models.credit, attributes: ['credits'] } });
        if (!foundCredits) {
            return res.status(404).send({ message: 'Store has no credit information' })
        }
        const result = Number(((foundCredits || {}).credit || {}).credits || 0);
        return res.send({
            credits: result
        })
    } catch (error) {
        next(error)
    }
}

const addStoreCredits = async (req, res, next) => {
    try {
        const { store, amount } = req.query;
        const foundCredits = await models.store.findOne({ where: { name: decodeURIComponent(store) }, include: { model: models.credit } });
        if (!foundCredits) {
            return res.status(404).send({ message: 'Store has no credit information' })
        }
        const credits = Number(((foundCredits || {}).credit || {}).credits) + Math.floor(Math.abs(amount)),
            id = ((foundCredits || {}).credit || {}).id;
        const update = await models.credit.update({ credits }, { where: { id } })
        if (! (update && update[0])) {
            return res.status(500).send({ message : `Store's credits could not be updated` })
        }
        const history = await models.transaction.create({type : 1, amount : Math.floor(Math.abs(amount)), userId : req.userInfo.id, storeId : req.storeInfo.id },{ returning: ['id']  });
        if (!history && !history.id) {
            console.error(`Could not save history for adding transaction on store: ${decodeURIComponent(store)}. Amount: ${amount}`);
        }
        return res.send({
            credits,
            message: 'Store credits updated'
        })
    } catch (error) {
        next(error)
    }
}

const substractStoreCredits = async (req, res, next) => {
    try {
        const { store, amount } = req.query;
        const foundCredits = await models.store.findOne({ where: { name: decodeURIComponent(store) }, include: { model: models.credit } });
        if (!foundCredits) {
            return res.status(404).send({ message: 'Store has no credit information' })
        }
        const prevCredits = Number(((foundCredits || {}).credit || {}).credits);
        if (amount > prevCredits) {
            return res.status(409).send({ credits: prevCredits, message: 'Insufficient funds for selected store' })
        }
        const newCredits = Number(((foundCredits || {}).credit || {}).credits) - Math.ceil(Math.abs(amount)),
            id = ((foundCredits || {}).credit || {}).id;
        const update = await models.credit.update({ credits: newCredits }, { where: { id } })
        if (! (update && update[0])) {
            return res.status(500).send({ message : `Store's credits could not be updated` })
        }
        const history = await models.transaction.create({type : 0, amount : Math.floor(Math.abs(amount)), userId : req.userInfo.id, storeId : req.storeInfo.id },{ returning: ['id']  });
        if (!history && !history.id) {
            console.error(`Could not save history for adding transaction on store: ${decodeURIComponent(store)}. Amount: ${amount}`);
        }
        return res.send({
            credits: newCredits,
            message: 'Store credits updated'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { storeCredits, addStoreCredits, substractStoreCredits }
