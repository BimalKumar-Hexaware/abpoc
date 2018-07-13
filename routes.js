var express = require('express');
var router = express.Router();
var config = require('./config.js');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');

router.post('/api/webhook', function (req, res) {
	console.log("request", JSON.stringify(req.body));
	/*var actionName = req.body.queryResult.action;
	console.log("action", actionName);
	const agent = new WebhookClient({ request: req, response: res });
	let intentMap = new Map();
	var intentsLen = config.intents.length;
	for (i = 0; i < intentsLen; i++) {
		intentMap.set(config.intents[i], function (agent) {
			agent.add(new Suggestion('People Soft'));
			agent.add(new Suggestion('Work Day'));
			agent.add(new Text('Hi welcome to micro strategy. I am Emily, your virtual assistant. How can I help you'));
		});
	}*/
	const agent = new WebhookClient({ request: req, response: res });
	var intent = req.body.inputs.intent;
	console.log("intent", intent);
	if(intent == "actions.intent.MAIN") {
		agent.add(new Text('Hi welcome to micro strategy. I am Emily, your virtual assistant. How can I help you'));
	}
	agent.handleRequest(intentMap);
});

module.exports = router;



