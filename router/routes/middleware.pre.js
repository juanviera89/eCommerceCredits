const rfr = require('rfr')
const express = require("express");

const cors = (req, res, next) => {
       
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin' , '*');
    res.setHeader('Access-Control-Expose-Headers' , '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'username,awskey,userkey,devkey,Access-Control-Allow-Origin, Access-Control-Allow-Headers, ' +
                    'Origin, X-Requested-With, Content-Type, CORELATION_ID, content-type, responseType');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    if ('OPTIONS' == req.method) {
        console.log('OPTIONS', res.getHeaders());
        return res.sendStatus(200);
      }
      else {
        next();
      }
}

module.exports = [
    require('helmet')(),
    express.json(),
    express.urlencoded({ extended: true }),
    cors,
  /*   rfr('/components/req-id/idMiddleware').reqId,
    ['local', 'development'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('test') || cliArgs.get('log') ?
        require('morgan')(':date[iso] :method :url :remote-addr :response-time :status :req[Authorization] :req[userId]') : (req, res, next) => next()
 */]