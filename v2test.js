const express = require('express')
const app = express();
var helper = require('./helper');

const port = process.env.PORT || 8880;

app.get('/', (req, res) => {
    return helper.generateAccessToken().then((result) => {
        console.log('Dialogflow', result);
        res.send('token generated');
    }).catch((err) => {
        console.log("error", err);
        res.send(err);
    });
});

app.listen(port, () => console.log('Example app listening on port 8880!'))

