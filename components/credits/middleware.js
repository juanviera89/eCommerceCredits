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
            return res.status(400).json({ errors: errors.array(), message: `Request's inputs have one or more errors` });
        }
        const { client, store } = req.query;
        const foundStore = await models.client.findAll({ where: { email: client }, include: { model: models.store, where: { name: store } } })
        if (foundStore.length) {
            return next()
        } else {
            return res.status(404).send({ message: `No store ${client} or client ${store} combination found` })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Unespected server error' })
    }
}

module.exports = {
    getInputs,
    deleteInputs,
    postInput,
    validateClientStore
}