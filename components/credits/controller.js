const rfr = require('rfr');
const models = rfr('db/models').models;

const storeCredits = async (req, res, next) => {
    //TODO trycatch
    const {  store } = req.query;
    const credits = await models.store.findOne( { attributes : ['credit.credits'],  where : { name : store }, include : {model : models.credit , attributes : ['credits']} } );
    const result = ((credits || {}).credit || {}).credits || 0;
    return res.send( {
        credits:  result
    })
}

module.exports = {storeCredits}
