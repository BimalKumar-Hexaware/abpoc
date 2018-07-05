const { dialogflow, List } = require('actions-on-google')
const app = dialogflow();
app.intent('Default Welcome Intent', conv => {
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
            ['SELECTION_KEY_MODIFY_EVENTS']: {
                synonyms: [
                    'Modify calendar events',
                ],
                title: 'Modify calendar events',
                description: 'Lets you modify calendar events'
            },
        },
    }));
});

app.intent('Default Fallback Intent', (conv) => {
    console.log("DEBUG",conv.arguments);
});

app.intent('ab.getCalanderEventsQuery', (conv, params) => {
    conv.ask('I have your calendar details. Please provide the date and time');
});

app.intent('ab.getCalanderDateAndTime', (conv) => {
    console.log(conv.body.queryResult.action);
    conv.ask('You have a meeting with Alliance Bernstein at 9:30 over webex, a meeting with MR.John Doe at 11:00 in his office in New York office room 342');
});

module.exports = app;
