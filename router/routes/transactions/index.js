const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const mdlw = rfr('/components/transactions/middleware')
const validateUserAuth = rfr('/components/authentication/middleware').validateUserAuth
const transactionHistory = rfr('/components/transactions/controller').transactionHistory


const methods = { //Solo informativo para ayudar en la generacion de Swagger
    GET: {
        query: {
            user: {
                type: 'string',
                required: false
            },
            store: {
                type: 'string',
                required: false
            }
        },
        header: {
            Authorization: {
                type: 'string',
                required: true
            }
        }
    }
}

router.get('/', mdlw.getInputs, validateUserAuth , mdlw.translateQueryToId , transactionHistory);
module.exports = { methods, routes: router };