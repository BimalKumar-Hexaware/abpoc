var config = require('./config.js');
var request = require('request');
var async = require('async');
var botConfig = require('./abmspoc-e6fa7-9b84f81aec59.json');
var requestWithJWT = require('google-oauth-jwt').requestWithJWT();
var _ = require('lodash');

var self = {
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
    "salesByRegionReport": function () {
        console.log("inside helper salesByRegionReport");
        return new Promise(function (resolve, reject) {
            async.waterfall([
                function (cb) {
                    var options = {
                        method: 'POST',
                        url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/auth/login',
                        headers:
                        {
                            accept: 'text/html',
                            'content-type': 'application/json'
                        },
                        body:
                        {
                            username: 'Administrator',
                            password: '',
                            loginMode: 1,
                            maxSearch: 3,
                            workingSet: 0,
                            changePassword: false,
                            newPassword: 'string',
                            metadataLocale: 'en_us',
                            warehouseDataLocale: 'en_us',
                            displayLocale: 'en_us',
                            messagesLocale: 'en_us',
                            numberLocale: 'en_us',
                            timeZone: 'UTC',
                            applicationType: 35
                        },
                        json: true
                    };
                    request(options, function (error, response, body) {
                        if (error) {
                            reject("Auth request error", error);
                        }
                        console.log('FIRST HEADER', response.headers['set-cookie']);
                        console.log('HEADER x-mstr-authtoken', response.headers['x-mstr-authtoken']);
                        cb(null, response.headers['x-mstr-authtoken'], response.headers['set-cookie']);
                    });
                },
                function (mstrAuthToken, cookie) {
                    console.log("passed tokrn", mstrAuthToken);
                    var options = {
                        method: 'POST',
                        url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/reports/88719C9746FB893117148CACBA0CB92E/instances',
                        qs: { limit: '3' },
                        headers:
                        {
                            'x-mstr-projectid': 'B19DEDCC11D4E0EFC000EB9495D0F44F',
                            'x-mstr-authtoken': mstrAuthToken,
                            accept: 'application/json',
                            'content-type': 'application/json',
                            'Cookie': cookie,
                        },
                        body: {},
                        json: true
                    };
                    console.log("event request options", options);
                    request(options, function (error, response, body) {
                        if (error) {
                            reject("Event request error", error);
                        }
                        var salesReport = self.buildSalesReport(body.result.data.root.children);
                        resolve(salesReport);
                    });

                }
            ], function (error) {
                if (error) {
                    console.log("ERROR: ", error);
                    reject("Something went wrong!");
                }
            });
        });
    },
    "getEventReport": function () {
        console.log("inside helper getEventReport");
        return new Promise(function (resolve, reject) {
            async.waterfall([
                function (cb) {
                    var options = {
                        method: 'POST',
                        url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/auth/login',
                        headers:
                        {
                            accept: 'text/html',
                            'content-type': 'application/json'
                        },
                        body:
                        {
                            username: 'Administrator',
                            password: '',
                            loginMode: 1,
                            maxSearch: 3,
                            workingSet: 0,
                            changePassword: false,
                            newPassword: 'string',
                            metadataLocale: 'en_us',
                            warehouseDataLocale: 'en_us',
                            displayLocale: 'en_us',
                            messagesLocale: 'en_us',
                            numberLocale: 'en_us',
                            timeZone: 'UTC',
                            applicationType: 35
                        },
                        json: true
                    };
                    request(options, function (error, response, body) {
                        if (error) {
                            reject("Auth request error", error);
                        }
                        console.log('HEADER x-mstr-authtoken', response.headers['x-mstr-authtoken']);
                        cb(null, response.headers['x-mstr-authtoken'], response.headers['set-cookie']);
                    });
                },
                function (mstrAuthToken, cookie) {
                    console.log("passed tokrn", mstrAuthToken);
                    var options = {
                        method: 'POST',
                        url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/reports/B85A18A944D682077AD280BD71DFE38E/instances',
                        qs: { limit: '3' },
                        headers:
                        {
                            'x-mstr-projectid': 'B19DEDCC11D4E0EFC000EB9495D0F44F',
                            'x-mstr-authtoken': mstrAuthToken,
                            accept: 'application/json',
                            'content-type': 'application/json',
                            'Cookie': cookie
                        },
                        body: {},
                        json: true
                    };
                    console.log("event request options", options);
                    request(options, function (error, response, body) {
                        if (error) {
                            reject("Event request error", error);
                        }
                        var eventReport = self.buildEventReport(body.result.data.root.children);
                        resolve(eventReport);
                    });

                }
            ], function (error) {
                if (error) {
                    console.log("ERROR: ", error);
                    reject("Something went wrong!");
                }
            });
        });
    },
    "buildEventReport": function (data) {
        console.log("inside helper buildEventReport");
        var speechText = "", eventAssignedTo = "", eventContactAttendees = "", eventStart = "", eventEnd = "", eventType = "",
            eventSubject = "", eventLocation = "";
        var eventStartArray = [], eventEndArray = [];
        speechText = '<speak>Here are the event report details <break time="200ms"/>';
        _.forEach(data, function (value) {
            eventAssignedTo = (value.element.formValues.DESC == "") ? "Unable to find the event assigner informartion" : 'Event assigned to ' + value.element.formValues.DESC;
            eventContactAttendees = (value.children[0].element.name == "") ? "no contact attendees found" : "Event contact attendee is " + value.children[0].element.name;
            eventStartArray = value.children[0].children[0].element.name.split(" ");
            eventStart = '<s>Start date is <say-as interpret-as="date" format="mdy" detail="2">' + eventStartArray[0] + '</say-as><say-as interpret-as="time" format="hm12">' + eventStartArray[1] + ' ' + eventEndArray[2] + '</say-as></s>';
            eventEndArray = value.children[0].children[0].children[0].element.name.split(" ");
            eventEnd = '<s>End date is <say-as interpret-as="date" format="mdy" detail="2">' + eventEndArray[0] + '</say-as><say-as interpret-as="time" format="hm12">' + eventEndArray[1] + ' ' + eventEndArray[2] + '</say-as></s>';
            eventType = 'Event Type is ' + value.children[0].children[0].children[0].children[0].element.name;
            eventSubject = 'Event subject is ' + value.children[0].children[0].children[0].children[0].children[0].element.name;
            eventLocation = (value.children[0].children[0].children[0].children[0].children[0].children[0].element.name == "") ? 'Event location is not provided'  : 'and the event location is ' + value.children[0].children[0].children[0].children[0].children[0].children[0].element.name;
            //eventSubject = eventSubject.replace(/\\\//g, "/");;
            speechText += '<s>' + eventAssignedTo + '.</s><s>' + eventContactAttendees + '.</s>' + eventStart + eventEnd;
            speechText += '<s>' + eventType + '.</s><s>' + eventLocation + '</s>';
            //<s>' + eventSubject + '</s>
            speechText += '<break time="1s"/>';
        });
        speechText += "</speak>";
        return speechText;
    },
    "buildSalesReport": function (data) {
        console.log("inside helper buildEventReport");
        var speechText = "", region = "", category = "";
        region = data[0].element.name;
        category = data[0].children[0].element.name;
        speechText = '<speak>Here are the sales report details <break time="200ms"/>';
        _.forEach(data[0].children[0].children, function (value) {
            speechText += '<s>Region ' + region + '.</s><s>Category ' + category + '.</s><s>Year' + value.element.name + '</s><s>Revenue ' + value.metrics.Revenue.fv + '</s><s>and the units sold is ' + value.metrics['Units Sold'].fv + '</s>';
            speechText += '<break time="1s"/>';
        });
        speechText += "</speak>";
        return speechText;
    },
    "getSalesInfo": function (rprtId) {
        //EE5687854B3A8B7C9144AA9C0BB2FD75
        reportId = rprtId || "30482C1945D0C6D0AC3D2AB55F293A05";
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
                        url: 'http://10.82.185.43:10086/json-data-api/reports/' + reportId + '/instances',
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
                        url: 'http://10.82.185.43:10086/json-data-api/reports/' + reportId + '/instances/' + instanceId,
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
                            "Region " + body.result.data.root.children[0].children[0].element.name + " " +
                            "Regional Manager " + body.result.data.root.children[0].children[0].children[0].element.name + " " +
                            "Count of Branch " + body.result.definition.metrics[0].max + " " +
                            "Branch Rank " + body.result.definition.metrics[1].max + " " +
                            "MF & SMA Pr. Year Sales " + body.result.definition.metrics[2].max + " " +
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
    },
    "generateAccessToken": function () {
        return new Promise((resolve, reject) => {
            requestWithJWT({
                url: 'https://www.googleapis.com/drive/v2/files',
                jwt: {
                    email: botConfig.client_email,
                    key: botConfig.private_key,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
    }
};

module.exports = self;
