const rfr = require('rfr');
const config = require('config')
const models = rfr('db/models').models;
const { validationResult, header } = require('express-validator');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const getInputs = [ //Input validators
    header('Authorization').notEmpty().isString()
]

const validateUserAuth = async (req, res, next) => { // Client-Store relation validation
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: `Request's inputs have one or more errors` });
        }
        const token = `${req.header('Authorization')}`.replace(/Bearer/g, '').trim()
        const signing = `${jwt.sign({ access_token: 'none' }, config.get('tokenSecret'), { expiresIn: 1 })}`.split('.')[0]
        let valid;
        try {
            valid = jwt.verify(`${signing}.${token}`, config.get('tokenSecret'));
        } catch (err) {
            ['development', 'test'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('log') ? console.warn('Invalid Bearer Token provided') : null
        }
        const {access_token} = valid || {};
        if (!valid || !access_token) {
            return res.status(403).send({message : 'Invalid Authentication token'});
        }
        const foundToken = await models.access_token.findOne({attributes: ['creation_date', 'token'],  where: { token: access_token }, include: { model: models.user, as : 'userToken'  } });
        if (foundToken ) {
            res.userInfo = foundToken.userToken;
            return next()
        } else {
            return res.status(403).send({ message: `Invalid Access token` })
        }
    } catch (error) {
        ['development', 'test'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('log') ? console.error(error) : null
        return res.status(500).send({ message: 'Unespected server error' })
    }
}

module.exports = {
    getInputs, validateUserAuth
}