const rfr = require('rfr');
const models = rfr('db/models').models;

const storeCredits = async (req, res, next) => {
    //TODO trycatch
    const { store } = req.query;
    const foundCredits = await models.store.findOne({ attributes: ['credit.credits'], where: { name: store }, include: { model: models.credit, attributes: ['credits'] } });
    if (!foundCredits) {
        return res.status(404).send({ message: 'Store has no credit information' })
    }
    const result = Number(((foundCredits || {}).credit || {}).credits || 0);
    return res.send({
        credits: result
    })
}

const addStoreCredits = async (req, res, next) => {
    //TODO trycatch
    const { store, amount } = req.query;
    const foundCredits = await models.store.findOne({  where: { name: store }, include: { model: models.credit } });
    if (!foundCredits) {
        return res.status(404).send({ message: 'Store has no credit information' })
    }
    const credits = Number(((foundCredits || {}).credit || {}).credits) + Math.floor(Math.abs(amount)),
    id = ((foundCredits || {}).credit || {}).id;
    const update = models.credit.update({credits}, { where : { id }})
    return res.send({
        credits,
        message : 'Store credits updated'
    })
}

const substractStoreCredits = async (req, res, next) => {
    //TODO trycatch
    const { store, amount } = req.query;
    const foundCredits = await models.store.findOne({  where: { name: store }, include: { model: models.credit } });
    if (!foundCredits) {
        return res.status(404).send({ message: 'Store has no credit information' })
    }
    const prevCredits = Number(((foundCredits || {}).credit || {}).credits);
    if ( amount > prevCredits) {
        return res.status(409).send({credits : prevCredits, message : 'Insufficient funds for selected store'})
    }
    const newCredits = Number(((foundCredits || {}).credit || {}).credits) - Math.ceil(Math.abs(amount)),
    id = ((foundCredits || {}).credit || {}).id;
    const update = models.credit.update({credits : newCredits}, { where : { id }})
    return res.send({
        credits : newCredits,
        message : 'Store credits updated'
    })
}

module.exports = { storeCredits, addStoreCredits, substractStoreCredits }
