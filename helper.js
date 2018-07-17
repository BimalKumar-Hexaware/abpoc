var config = require('./config.js');
var request = require('request');
var async = require('async');

module.exports = {
    "queryDialogflow": function (rawQuery) {
        console.log('inside queryDialogflow');
        return new Promise(function (resolve, reject) {
            var options = {
                //proxy: 'http://gmdvproxy.acml.com:8080/',
                method: 'POST',
                url: config.dialogflowV1API,
                headers:
                {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + config.v1ClientAccessToken
                },
                body:
                {
                    lang: 'en',
                    query: rawQuery,
                    sessionId: '12345',
                    timezone: 'America/New_York'
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    reject("Something went wrong when processing your request. Please try again.");
                }
                console.log(body);
                resolve(body.result);
            });
        });
    },
    "getSalesInfo": function () {
	return new Promise(function (resolve, reject) {
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

                    console.log("FIRST API AUTH TOKEN", JSON.parse(body).authToken);
                    cb(null, JSON.parse(body).authToken);
                });
            },
            function (authToken, cb) {
                console.log("First Response in second req", authToken);
                var options = {
                    method: 'POST',
                    url: 'http://10.82.185.43:10086/json-data-

api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances',
                    qs: { offset: '0', limit: '1000' },
                    headers:
                    {
                        'x-mstr-authtoken': authToken,
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
                    cb(null, authToken, JSON.parse(body).instanceId);
                });

            },
            function (authToken, instanceId, cb) {
                console.log("First Response in third req", authToken);
                console.log("Second Response", instanceId);
                var options = {
                    method: 'GET',
                    url: 'http://10.82.185.43:10086/json-data-

api/reports/30482C1945D0C6D0AC3D2AB55F293A05/instances/' + instanceId,
                    qs: { offset: '0', limit: '1000' },
                    headers:
                    {
                        'x-mstr-authtoken': authToken,
                        'cache-control': 'no-cache',
                        accept: 'application/vnd.mstr.dataapi.v0+json'
                    }
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    console.log("THIRD API BODY", JSON.parse(body).result);
body = JSON.parse(body);
                    var conversation = "Here are the details " +
                        "Firm " + body.result.data.root.children[0].element.name + " " +
                        "Region " + body.result.data.root.children[0].children[0].element.name + " " 

+
                        "Regional Manager " + body.result.data.root.children[0].children

[0].element.name + " " +
                        "Count of Branch " + body.result.definition.metrics[0].max + " " +
                        "Branch Rank " + body.result.definition.metrics[1].max + " " +
                        "MF & SMA Pr. Year Sales " + body.result.definition.metrics[2].max + " "+
                        "Total RM YTD Sales " + body.result.definition.metrics[4].max + " ";
                    resolve(conversation);
                });

            }
        ], function (error) {
            if (error) {
                console.log("ERROR: ", error);
                reject("Something went wrong!");
            }
        });
});
    }
};
