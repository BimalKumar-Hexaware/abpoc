const { dialogflow, List } = require('actions-on-google')
const app = dialogflow({ debug: true });
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
    console.log("Selected option key", conv.arguments.raw.input.OPTION.textValue);
    switch (conv.arguments.raw.input.OPTION.textValue) {
        case 'SELECTION_KEY_GET_CALENDAR_EVENTS':
            conv.followup('getcalendardetails-event');
            break;
        case 'SELECTION_KEY_MODIFY_EVENTS':
            conv.followup('modifycalendardetails-event');
            break;
    }
});

app.intent('ab.getCalanderEventSelected', (conv, params) => {
    conv.ask('Sure. Please provide the date and time');
});

app.intent('ab.modifyCalendarEventSelected', (conv, params) => {
    conv.ask('I can do it for you. Please provide the date, scheduled time and the new time of the meeting');
});

app.intent('ab.getCalanderEventsQuery-getInfo', (conv) => {
    var parameters = conv.parameters;
    console.log("parameters", parameters);
    var date_time = parameters.date_time;
    conv.ask('You have a meeting with Alliance Bernstein at 9:30 over webex, a meeting with MR.John Doe at 11:00 in his office in New York office room 342');
});

app.intent('ab.modifyCalendarEventSelected-getInfo', (conv) => {
    var parameters = conv.parameters;
    console.log("parameters", parameters);
    var messages = ["You have an conflict with your calendar  timing at 2:00", "Your meeting has been moved to the requested time"];
    conv.ask(messages[Math.floor(Math.random() * messages.length)]);
});

module.exports = app;
