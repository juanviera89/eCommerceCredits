const rfr = require('rfr');
const models = rfr('db/models').models;
const { validationResult, query, header } = require('express-validator');

const getInputs = [ //Input validators
    query('client').notEmpty().isEmail().trim(), query('store').notEmpty().isString().trim().isLength({ min: 1, max: 64 }), header('Authorization').notEmpty().isString()
], deleteInputs = [
    query('client').notEmpty().isEmail().trim(), query('store').notEmpty().isString().trim().isLength({ min: 1, max: 64 }), query('amount').notEmpty().isNumeric(), header('Authorization').notEmpty().isString()
], postInput = [
    query('client').notEmpty().isEmail().trim(), query('store').notEmpty().isString().trim().isLength({ min: 1, max: 64 }), query('amount').notEmpty().isNumeric(), header('Authorization').notEmpty().isString()
]

const validateClientStore = async (req, res, next) => { // Client-Store relation validation
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: `Request's inputs contains one or more errors` });
        }
        const { client, store } = req.query;
        const foundStore = await models.client.findOne({ where: { email: client }, include: { model: models.store, where: { name: decodeURIComponent(store) } } });
        if (foundStore && foundStore.stores && foundStore.stores[0]) {
            req.storeInfo = foundStore.stores[0];
            return next()
        } else {
            return res.status(404).send({ message: `No store ${client} or client ${decodeURIComponent(store)} combination found` })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getInputs,
    deleteInputs,
    postInput,
    validateClientStore
}