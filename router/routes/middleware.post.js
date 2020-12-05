
const rfr = require('rfr');

const errorHandle = (err, req, res, next) => {
    const title = 'Error in ' + req.method + ' ' + req.url
    let serializedErr
    try {
        serializedErr = JSON.stringify(err)
    } catch (error) {
        if (err.toString) {
            serializedErr = err.toString()
        } else {
            serializedErr = `${err}`
        }
    } 
    let body = {
        "name": err.name ,
        "code": err.errId,
        "message": err.message,
        "help":err.help
    }
    
    const errObj = {
        id: req.transactionId,
        title,
        original: err,
         serializedErr
    }
    res.status(err.code || 500).send(body);
    if(cliArgs.get('log')) console.error(errObj)
    return 
}

module.exports = [
    errorHandle
]