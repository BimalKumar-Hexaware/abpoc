const express = require('express')
const app = express();
var request = require("request");
var async = require('async');
var helper = require('./helper');

const port = process.env.PORT || 8880;

app.get('/', (req, res) => {

    return helper.getSalesInfo().then((result) => { 
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(port, () => console.log('Example app listening on port 8880!'))

