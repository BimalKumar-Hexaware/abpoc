const express = require('express')
const app = express();
var request = require("request");
var async = require('async');
const port = process.env.PORT || 8880;

app.get('/', (req, res) => {

    async.waterfall([
        function (cb) {
            var options = {
                method: 'POST',
                url: 'http://10.82.185.43:10086/json-data-api/sessions',
                headers:
                {
                    'postman-token': 'cbfbf74a-6df6-4006-a29c-97b8bf3ef6d9',
                    'x-username': 'Test_voice',
                    'x-projectname': 'AB Intelligence',
                    'x-port': '34952',
                    'x-password': 'Password',
                    'x-iservername': 'W05D0541',
                    'x-authmode': '1',
                    'content-type': 'application/json',
                    'cache-control': 'no-cache',
                    accept: 'application/vnd.mstr.dataapi.v0+json'
                }
            };

            request(options, function (error, response, body) {
                if (error) {
                    console.log("first API error", error)
                    if (error) throw new Error(error);
                };

                console.log("FIRST API BODY", body);
                cb(JSON.parse(body));
            });
        },
        function (firstResp, cb) {
            console.log("First Response in second req", firstResp);
            var options = {
                method: 'POST',
                url: 'http://10.82.185.43:10086/json-data-api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances',
                qs: { offset: '0', limit: '1000' },
                headers:
                {
                    'x-mstr-authtoken': firstResp.authToken,
                    'content-type': 'application/vnd.mstr.dataapi.v0+json',
                    'cache-control': 'no-cache',
                    accept: 'application/vnd.mstr.dataapi.v0+json'
                }
            };

            request(options, function (error, response, body) {
                if (error) {
                    console.log("second API error", error)
                    if (error) throw new Error(error);
                };

                console.log("SECOND API BODY", body);
                cb(firstResp, JSON.parse(body));
            });

        },
        function (firstResp, secondResp, cb) {
            console.log("First Response in third req", firstResp);
            console.log("Second Response", secondResp);
            var options = {
                method: 'GET',
                url: 'http://10.82.185.43:10086/json-data-api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances/' + secondResp.instanceId,
                qs: { offset: '0', limit: '1000' },
                headers:
                {
                    'x-mstr-authtoken': firstResp.authToken,
                    'cache-control': 'no-cache',
                    accept: 'application/vnd.mstr.dataapi.v0+json'
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log("THIRD API BODY", body);
                res.json(body);
            });

        }
    ], function (error) {
        if (error) {
            console.log("ERROR: ", error);
            res.send("Something went wrong!");
        }
    });
});

app.listen(port, () => console.log('Example app listening on port 3000!'))
