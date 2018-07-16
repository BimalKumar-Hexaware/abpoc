const express = require('express')
const app = express();
var Http = require('http');

const port = process.env.PORT || 8880;

app.get('/', (req, res) => {
    var req = Http.request({
        host: 'http://gmdvproxy.acml.com',
        // proxy IP
        port: 8080,
        // proxy port
        method: 'GET',
        path: 'http://10.82.184.75:8880/test' // full URL as path
    }, function (res) {
        res.on('data', function (data) {
            console.log(data.toString());
        });
    });

    req.end();
    res.send('req sent');
});
app.post('/webhook/api', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    res.send('Hello World!')
});

app.listen(port, () => console.log('Example app listening on port 3000!'))