const rfr = require('rfr');
const config = require('config')
const jwt = require('jsonwebtoken');
const auth = require('basic-auth');
const models = rfr('db/models').models;
const md5 = require('md5');
const { validationResult } = require('express-validator');

const authorization = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: `Request's inputs have one or more errors` });
        }
        const { name, pass } = auth(req);
        const password = md5(pass);
        const foundUser = await models.user.findOne({ where: { email: name, password } });
        if (!foundUser) {
            return res.status(403).send({ message: 'email/password combination not found' });
        }
        const access_token = md5(`${foundUser.email}${Date.now()}`);
        const insert = await models.access_token.create({ userId: foundUser.id, token: access_token }, { returning: ['token'] });
        if (!(insert && insert.dataValues)) {
            return res.status(500).send({ message: 'Could not generate user access permission' })
        }
        const token = jwt.sign({ access_token }, config.get('tokenSecret'), { expiresIn: '5m' });
        return res.send({
            message: 'Authentication successful',
            authToken: `${token.split('.')[1]}.${token.split('.')[2]}`,
            token :  jwt.verify(token, config.get('tokenSecret')),
            token2: token
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { authorization }