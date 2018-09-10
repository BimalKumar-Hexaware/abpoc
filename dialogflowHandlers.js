const { List, actionssdk } = require('actions-on-google')
const app = actionssdk(/*{ debug: true }*/);
var helper = require('./helper');

app.intent('actions.intent.MAIN', conv => {
    conv.ask('<speak>Hi <break time="200ms"/> Welcome to Microstrategy. I am Simon, your virtual assistant. Please tell me how can I help you</speak>');
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

app.intent('actions.intent.CLOSE', (conv, input) => {
    conv.ask('Happy to help you.See you later!').close();
});

app.intent('actions.intent.TEXT', (conv, input) => {
    console.log("Raw input: " + conv.input.raw);
    console.log("Input: " + input);
    if (input === 'bye' || input === 'goodbye' || input == 'close microstrategy'|| input == 'close') {
        conv.ask('Happy to help you.See you later!').close();
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
            case 'ab.thankIntent':
                response = result.fulfillment.messages[0].textToSpeech;
                conv.ask(response);
                break;
            case 'ab.thankIntent-yes':
                response = result.fulfillment.messages[0].textToSpeech;
                conv.ask(response);
                break;
            case 'ab.thankIntent-no':
                response = result.fulfillment.messages[0].textToSpeech;
                conv.ask(response).close();
                break;
            case 'ab.getSalesInfo':
                return helper.salesByRegionReport().then((result) => {
                    console.log('sales report result', result);
                    conv.ask(result);
                }).catch((err) => {
                    console.log("SALES INFO - some error occured");
                    conv.ask("Sorry, something went wrong");
                });
                break;
            case 'ab.getCalanderEvent':
                return helper.getEventReport().then((result) => {
                    console.log('event report result', result);
                    conv.ask(result);
                }).catch((err) => {
                    console.log("EVENT REPORT - some error occured");
                    conv.ask("Sorry, something went wrong");
                });
                break;
        }
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = app;