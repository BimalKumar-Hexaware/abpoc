var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  switch (req.body.queryResult.action) {
    case "input.welcome":
      console.log("*************Inside welcome intent*************");
      res.json({
        "fulfillmentText": "Hi welcome to micro strategy. I am Emily, your virtual assistant. Please choose how can I help you"
      }).end();
      break;
  }
});

module.exports = router;
