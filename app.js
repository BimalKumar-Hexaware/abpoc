const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')
const port = process.env.PORT || 3000;

var app = express();
const dialogflowApp = dialogflow();

dialogflowApp.intent('Default Welcome Intent', conv => {
  conv.ask('Hi welcome to micro strategy. I am Emily, your virtual assistant. Please tell me how can I help you');
  conv.followup('mainmenu_event');
});

app.use(bodyParser.json(), dialogflowApp).listen(port, function () {
  console.log('App listening on port:' + port);
})
