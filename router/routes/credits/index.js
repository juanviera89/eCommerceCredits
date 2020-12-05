const express = require('express')
const rfr = require('rfr')
const router = express.Router();
const mdlw = rfr('/components/credits/middleware')
const validateUserAuth = rfr('/components/authentication/middleware').validateUserAuth
const storeCredits = rfr('/components/credits/controller').storeCredits
const addStoreCredits = rfr('/components/credits/controller').addStoreCredits
const substractStoreCredits = rfr('/components/credits/controller').substractStoreCredits


const methods = { //Solo informativo para ayudar en la generacion de Swagger
    GET: {
        query: {
            client: {
                type: 'string',
                required: true
            },
            store: {
                type: 'string',
                required: true
            }
        },
        header: {
            Authorization: {
                type: 'string',
                required: true
            }
        }
    },
    POST: {
        query: {
            client: {
                type: 'string',
                required: true
            },
            store: {
                type: 'string',
                required: true
            },
            amount: {
                type: 'number',
                required: true
            }
        },
        header: {
            Authorization: {
                type: 'string',
                required: true
            }
        }
    },
    DELETE: {
        query: {
            client: {
                type: 'string',
                required: true
            },
            store: {
                type: 'string',
                required: true
            },
            amount: {
                type: 'number',
                required: true
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

router.get('/', mdlw.getInputs, validateUserAuth , mdlw.validateClientStore , storeCredits);
router.post('/', mdlw.postInput , validateUserAuth , mdlw.validateClientStore , addStoreCredits);
router.delete('/', mdlw.deleteInputs , validateUserAuth , mdlw.validateClientStore , substractStoreCredits);
module.exports = { methods, routes: router };