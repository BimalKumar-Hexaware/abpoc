const express = require('express')
const app = express();
var helper = require('./helper');

const port = process.env.PORT || 8880;

app.post('/simulation', (req, res) => {
    return helper.queryDialogflow("get sales info").then((result) => {
        console.log('Dialogflow', JSON.stringify(result));
        return helper.getSalesInfo().then((result) => {
            res.send(result);
        }).catch((err) => {
            res.send(err);
        });
    }).catch((err) => {
        console.log("some error occured");
        res.send(err);
    });
});

app.listen(port, () => console.log('Example app listening on port 8880!'))

