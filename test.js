const express = require('express')
const app = express();
var helper = require('./helper');

const port = process.env.PORT || 8880;

app.get('/test', (req, res) => {
    return helper.getEventReport().then((result) => {
        //console.log('result', JSON.parse(result).header);
        res.json(result);
    }).catch((err) => {
        console.log("some error occured");
        res.send(err);
    });
});

app.listen(port, () => console.log('Example app listening on port 8880!'))

