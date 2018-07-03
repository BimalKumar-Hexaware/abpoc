var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  switch (req.body.inputs.intent) {
    case "actions.intent.MAIN":
      res.json({
        "textToSpeech": "Hi welcome to micro strategy. I am Emily, your virtual assistant. Please choose how can I help you",
        "ssml": "Hi welcome to micro strategy. I am Emily, your virtual assistant. Please choose how can I help you",
        "displayText": "Hi welcome to micro strategy. I am Emily, your virtual assistant. Please choose how can I help you"
      }).end();
      break;
  }
});

module.exports = router;
