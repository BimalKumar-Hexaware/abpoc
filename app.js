const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow } = require('actions-on-google')
const port = process.env.PORT || 3000;

var app = express();
const dialogflowApp = dialogflow();

dialogflowApp.intent('Default Welcome Intent', conv => {
  conv.ask('Hi, how is it going?')
  conv.ask(`Here's a picture of a cat`)
  conv.ask(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
});

app.use(bodyParser.json(), dialogflowApp).listen(port, function () {
  console.log('App listening on port:' + port);
})
