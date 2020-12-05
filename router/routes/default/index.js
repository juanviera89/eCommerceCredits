const express = require('express')
const rfr = require('rfr')
const router = express.Router();

const defaultFunction = (req, res) => {
    try {

        if (['local', 'test', 'development'].includes(process.env.NODE_ENV.toLowerCase())) console.log(req.transactionId, 'Default route reached');
        res.status(200).send(JSON.stringify({message : "Path Not found", ReqID: req.transactionId}));
    } catch (error) {
         dblog.create({
            transactionId: req.transactionId, message: error.message || `Unkown Error @defaultFunction`,
            originObject: JSON.stringify(error),
            isError: true
        })
        if (['local', 'test', 'development'].includes(process.env.NODE_ENV.toLowerCase())) console.error(error);
    }
}

router.get('/',defaultFunction)
router.post('/',defaultFunction)
router.put('/',defaultFunction)
router.delete('/',defaultFunction)
router.all('/',defaultFunction)

module.exports = router;