const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;

var app = express();
const dialogflowApp = require('./dialogflowHandlers');

app.use(bodyParser.json(), dialogflowApp).listen(port, function () {
  console.log('App listening on port:' + port);
})
