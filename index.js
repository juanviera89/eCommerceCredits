if (!process.env.NODE_ENV || process.env.NODE_ENV === undefined || process.env.NODE_ENV === null) require('dotenv').config();
const config = require('config')
const express = require('express')
global.cliArgs = new (require('./utils/args'));
const app = require('./app')


let serverInit = async (app, PORT = 2019, HOST = '0.0.0.0') => {

  return new Promise((resolve) => {
      app.listen(PORT, HOST, () => {
        resolve()
      })
    
  });
}

const main = async () => {

  try {
    console.log('====================================');
    console.log(process.env.NODE_ENV);
    console.log(cliArgs.getAll())
    console.log('====================================');
    console.log('Connecting to DB')
    const db = require('./db');
    await db.authenticate()
    require('./db/models').initModels(db);
    await db.sync();
    console.log('Connected')
    console.log('====================================')
    console.log('Initializing routes')
    if (cliArgs.get('test')) console.log('TEST MODE: ON')
    const router = require('./router')
    const path = require("path");
    router.setDescriptionExporter( ['development', 'test'].includes(process.env.NODE_ENV.toLowerCase()) || cliArgs.get('log') ?  (desc) => console.log(JSON.stringify(desc)) : false ) 
    app.initApp('main');
    router.initRoutes( app.getApp('main'), path.join(__dirname, 'router') )
    console.log('Starting server')
    const PORT = parseInt(process.env.PORT || config.get('server.port') || 1989)
    const HOST = process.env.HOST || config.get('server.host') || '0.0.0.0'
    serverInit( app.getApp('main'),  PORT, HOST)
    app.setReady('main')
    console.log(`Ecommerce Credits API listening:  ${HOST}:${PORT}!`)
    console.log('====================================')
    //console.log( JSON.stringify(await require('./db/models').models.client.findAll({ include : require('./db/models').models.store })));

  } catch (error) {
    console.error('Fatal errror - Could Not initialize service')
    console.error(error);

  }

}

main()
module.exports = app;