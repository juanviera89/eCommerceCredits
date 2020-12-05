const rfr = require('rfr');
const models = rfr('db/models').models;
const { validationResult, query, header } = require('express-validator');

const getInputs = [ //Input validators
    query('store').optional().isString().trim().isLength({ min: 1, max: 64 }), query('user').optional().isString().trim().isLength({ min: 1, max: 64 }), header('Authorization').notEmpty().isString()
]

const translateQueryToId = async (req, res, next) => { // Client-Store relation validation
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: `Request's inputs contains one or more errors` });
        }
        const { user, store } = req.query;
        if (store) {
            const foundStore = await models.store.findOne({ where: { name: store }});
            console.log('store found', store, foundStore);
            if (foundStore && foundStore.id) {
                req.query.storeInfo = foundStore;
            } else {
                return res.send({
                    history: []
                })
            }
        }
        if (user) {
            const foundUser = await models.user.findOne({ where: { email: user }});
            console.log('user found', user, foundUser);
            if (foundUser && foundUser.id) {
                req.query.userInfo = foundUser;
            } else {
                return res.send({
                    history: []
                })
            }
        }
        return next()
    } catch (error) {
        ['development', 'test'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('log') ? console.error(error) : null
        return res.status(500).send({ message: 'Unespected server error' })
    }
}

module.exports = {
    getInputs,
    translateQueryToId
}