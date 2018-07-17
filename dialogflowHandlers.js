const { dialogflow, List, actionssdk } = require('actions-on-google')
const app = actionssdk();
var helper = require('./helper');

app.intent('actions.intent.MAIN', conv => {
    conv.ask('Hi welcome to micro strategy. I am Emily, your virtual assistant. Please tell me how can I help you');
    conv.ask(new List({
        title: 'Please choose',
        items: {
            ['SELECTION_KEY_GET_CALENDAR_EVENTS']: {
                synonyms: [
                    'Get calendar events',
                ],
                title: 'Get calendar events',
                description: 'Lets you retrieve calendar events',
            },
            ['SELECTION_KEY_GET_SALES_INFO']: {
                synonyms: [
                    'Get sales information',
                ],
                title: 'Get sales information',
                description: 'Lets you get your sales related information'
            },
        },
    }));
});

app.intent('actions.intent.OPTION', (conv, params, option) => {
    console.log(option);
    switch (option) {
        case 'SELECTION_KEY_GET_CALENDAR_EVENTS':
            return helper.queryDialogflow("get calendar events").then((result) => {
                console.log('dfrersult', JSON.stringify(result));
                conv.ask(result.fulfillment.messages[0].textToSpeech);
            }).catch((err) => {
                res.send(err);
            })
            break;
        case 'SELECTION_KEY_GET_SALES_INFO':
            return helper.queryDialogflow("get sales info").then((result) => {
                console.log('dfrersult', JSON.stringify(result));
                conv.ask(result.fulfillment.messages[0].textToSpeech);
            }).catch((err) => {
                res.send(err);
            })
            break;
    }
});


app.intent('actions.intent.TEXT', (conv) => {
    conv.ask('hmm. i need an api call');
});

module.exports = app;

/*var rawQuery = req.body.inputs[0].rawInputs[0].query;
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
});*/
