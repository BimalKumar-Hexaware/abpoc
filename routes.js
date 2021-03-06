var express = require('express');
var router = express.Router();
var helper = require('./helper');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
const { dialogflow, List } = require('actions-on-google');
const key = require('./abmspoc-e6fa7-cf116347d6d7.json');
const { google } = require('googleapis');
var jwksClient = require('jwks-rsa');


router.post('/api/webhook', function (req, res) {
	console.log("request", JSON.stringify(req.body));
	const agent = new WebhookClient({ request: req, response: res });

	/*var rawQuery = req.body.inputs[0].rawInputs[0].query;
	console.log("rawQuery", rawQuery);
	return helper.queryDialogflow(rawQuery).then((result) => {
		console.log('dfrersult', JSON.stringify(result));
		result.fulfillment.messages[0].textToSpeech;
	}).catch((err) => {
		res.send(err);
	})*/

	agent.add(new Suggestion('People Soft'));
	agent.add(new Suggestion('Work Day'));
});

router.get('/test', function (req, res) {

	var rawQuery = 'hi';
	console.log("rawQuery", rawQuery);
	return helper.queryDialogflow(rawQuery).then((result) => {
		console.log('dfrersult', JSON.stringify(result));
		console.log("please find the console output");
		res.json(result);
	}).catch((err) => {
		res.send(err);
	})

});

module.exports = router;




