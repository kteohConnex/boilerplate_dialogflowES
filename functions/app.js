const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const admin = require('firebase-admin')
const fs = require('fs')
const app = express()
require('dotenv').config()
const path = './credentials.json';

// Firebase Setup
if(fs.existsSync(path)){
  var serviceAccount = require(path);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp();
}

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

// Routes
app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (request, response) => {
  console.log("request: ", request)
  const agent = new WebhookClient({ request, response })

  function welcome () {
    agent.add('Welcome to my agent!')
  }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)
  agent.handleRequest(intentMap)
});

module.exports = app