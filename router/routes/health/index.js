const express = require('express')
const rfr = require('rfr')
const router = express.Router();

const healthFunction = (req, res) => {
    try {
        if (['local', 'test', 'development'].includes(process.env.NODE_ENV.toLowerCase())) console.log(req.transactionId, 'health route reached');
        res.status(200).send(`This server seems healthy and you used http ${req.method} to read this`);
    } catch (error) {
         dblog.create({
            transactionId: req.transactionId, message: error.message || `Unkown Error @healthFunctioná`,
            originObject: JSON.stringify(error),
            isError: true
        })
        if (['local', 'test', 'development'].includes(process.env.NODE_ENV.toLowerCase())) console.error(error);
    }
}

router.get('/',healthFunction)
router.post('/',healthFunction)
router.put('/',healthFunction)
router.delete('/',healthFunction)

module.exports = router;