const rfr = require('rfr');
const models = rfr('db/models').models;
const {  validationResult, query } = require('express-validator');

const getInputs = [
    query('client').isEmail().trim(), query('store').isString().trim().isLength({ min: 1, max: 64 })
], deleteInputs = [
    query('client').isEmail().trim(), query('store').isString().trim().isLength({ min: 1, max: 64 }), query('amount').isNumeric()
], postInput = [
    query('client').isEmail().trim(), query('store').isString().trim().isLength({ min: 1, max: 64 }), query('amount').isNumeric()
]



const validateClientStore = async (req, res, next) => {
    //TODO trycatch
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: `Request's inputs have one or more errors` });
    }
    const { client, store } = req.query;
    const foundStore = await models.client.findAll({ where: { email: client }, include: { model: models.store, where: { name: store } } })
    if (foundStore.length) {
        return next()
    } else {
        return res.status(404).send({ message: `No store ${client} or client ${store} combination found` })
    }
}

module.exports = {
    getInputs,
    deleteInputs,
    postInput,
    validateClientStore
}