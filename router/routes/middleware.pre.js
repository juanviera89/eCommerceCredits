const rfr = require('rfr')
const express = require("express");

const cors = (req, res, next) => {
       
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin' , '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, ' +
                    'Origin, X-Requested-With, Content-Type, content-type, responseType, Authorization');
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
    cors]