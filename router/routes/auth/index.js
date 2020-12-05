const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const mdlw = rfr('/components/authentication/middleware')
const auth = rfr('/components/authentication/controller').authorization


const methods = { //Solo informativo para ayudar en la generacion de Swagger
    GET: {
        header: {
            Authorization: {
                type: 'string',
                required: true
            }
        }
    }
}

router.get('/', mdlw.getInputs , auth);
module.exports = { methods, routes: router };