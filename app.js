const express = require('express')
const bodyParser = require('body-parser')
const { dialogflow,List } = require('actions-on-google')
const port = process.env.PORT || 3000;

var app = express();
const dialogflowApp = dialogflow();

dialogflowApp.intent('Default Welcome Intent', conv => {
  conv.ask('Hi welcome to micro strategy. I am Emily, your virtual assistant. Please tell me how can I help you');
  //conv.followup('mainmenu_event');
  conv.ask(new List({
    title: 'Please choose',
    items: {
      ['SELECTION_KEY_GET_CALENDAR']: {
        synonyms: [
          'Get calendar details',
        ],
        title: 'Get calendar details',
        description: 'Lets you retrieve calendar events',
      },
      ['SELECTION_KEY_MODIFY_CALENDAR']: {
        synonyms: [
          'Modify calendar events',
        ],
        title: 'Modify calendar events',
        description: 'Lets you modify calendar events'
      },
    },
  }));
});

app.use(bodyParser.json(), dialogflowApp).listen(port, function () {
  console.log('App listening on port:' + port);
})
