const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const mdlw = rfr('/components/credits/middleware')
const storeCredits = rfr('/components/credits/controller').storeCredits


const methods = {
    GET: {
        query: {
            number: {
                type: 'string',
                required: false
            },
            serial: {
                type: 'string',
                required: false
            },
            qr: {
                type: 'string',
                required: false
            }
        }
    }
}

router.get('/', mdlw.getInputs , mdlw.validateClientStore , storeCredits);
module.exports = { methods, routes: router };