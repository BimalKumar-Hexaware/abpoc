const { List, actionssdk } = require('actions-on-google')
const app = actionssdk({ debug: true });
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
            return helper.getEventReport().then((result) => {
                console.log('event report', result);
                conv.ask(result);
            }).catch((err) => {
                console.log("some error occured");
                conv.ask("Sorry, something went wrong");
            });
            break;
        case 'SELECTION_KEY_GET_SALES_INFO':
            return helper.salesByRegionReport().then((result) => {
                console.log('sales report', result);
                conv.ask(result);
            }).catch((err) => {
                console.log("some error occured");
                conv.ask("Sorry, something went wrong");
            });
            break;
            break;
    }
});


app.intent('actions.intent.TEXT', (conv, input) => {
    console.log(conv.input.raw);
    if (input === 'bye' || input === 'goodbye') {
        conv.close('See you later!');
        return;
    }
    return helper.queryDialogflow(conv.input.raw).then((result) => {
        console.log('dfrersult', JSON.stringify(result));
        var response;
        switch (result.action) {
            case 'input.unknown':
                response = result.fulfillment.messages[0].textToSpeech;
                conv.ask(response);
                break;
            case 'ab.getSalesInfo':
                return helper.salesByRegionReport().then((result) => {
                    console.log('sales report', result);
                    conv.ask(result);
                }).catch((err) => {
                    console.log("some error occured");
                    conv.ask("Sorry, something went wrong");
                });
                break;
            case 'ab.getCalanderEvent':
                return helper.getEventReport().then((result) => {
                    console.log('event report', result);
                    conv.ask(result);
                }).catch((err) => {
                    console.log("some error occured");
                    conv.ask("Sorry, something went wrong");
                });
                break;
        }
    }).catch((err) => {
        res.send(err);
    });
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
