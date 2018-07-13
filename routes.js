var express = require('express');
var router = express.Router();
var config = require('./config.js');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
const { dialogflow, List } = require('actions-on-google');
const key = require('./abmspoc-e6fa7-cf116347d6d7.json');
const { google } = require('googleapis');
var jwksClient = require('jwks-rsa');
var request = require('request');

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
	}
	const agent = new WebhookClient({ request: req, response: res });*/

	var rawQuery = req.body.inputs[0].rawInputs[0].query;
	console.log("rawQuery", rawQuery);
	let jwtClient = new google.auth.JWT(
		key.client_email, null, key.private_key,
		['https://www.googleapis.com/auth/cloud-platform'],
		null
	);
	jwtClient.authorize((err, tokens) => {
		request.post(config.dialogFlowAPI.replace('sessions', '123456789'), {
			'auth': {
				'bearer': tokens.access_token,
			},
			'json': true,
			'body': { "queryInput": { "text": { "text": rawQuery, "languageCode": "en" } } }
		}, (err, httpResponse, body) => {
			console.log(err, body);
			console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
		});
	});
});

module.exports = router;



