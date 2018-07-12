var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('./config.js');
var path = require("path");
var url = require('url');
const { google } = require('googleapis');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');


router.post('/api/webhook', function (req, res) {
	console.log("request", JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;
	console.log(actionName);
	const agent = new WebhookClient({ request: req, response: res });
	let intentMap = new Map();
	var intentsLen = config.intents.length;
	for (i = 0; i < intentsLen; i++) {
		intentMap.set(config.intents[i], userCheck);
	}
	agent.handleRequest(intentMap);
});

var userCheck = function (agent) {
	console.log(JSON.stringify(agent.request_.body));
	agent.add(new Card({
		title: 'Login ',
		text: 'Please click login to get access me',
		buttonText: 'Login',
		buttonUrl: 'http://localhost:3000/login.html?userId=' + agent.request_.body.originalDetectIntentRequest.payload.user.userId
	}));
	agent.add(new Suggestion('People Soft'));
	agent.add(new Suggestion('Work Day'));
}


module.exports = router;



