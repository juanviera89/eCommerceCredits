const express = require('express')
const config = require('config')
const app = {}//express()
const ready = {};

const initApp = (_id = `app${Date.now()}`) => {
  app[`${_id}`] = express();
  return _id
}

const setReady= (_id) => ready[_id] = true

const waitForAppReady = (_id, maxt) => {
  return new Promise((resolve, reject) => {    
    if (ready[_id]) return resolve(true);
    let n = 0
    const t = setInterval(() => {
      n += 100
      if (ready[_id]) return resolve(true)
      if(n >= maxt) return resolve(false)
    }, 100);
  });
}

const useInApp = (id, expressComponent) => app[id].use(expressComponent)

const getApp = (id) => app[id]

module.exports = {
  initApp,
  useInApp,
  getApp,
  waitForAppReady,
  setReady
}
