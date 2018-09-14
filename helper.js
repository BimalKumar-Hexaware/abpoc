var config = require('./config.js');
var request = require('request');
var async = require('async');
var botConfig = require('./abmspoc-e6fa7-9b84f81aec59.json');
var requestWithJWT = require('google-oauth-jwt').requestWithJWT();
var _ = require('lodash');
var Speech = require('ssml-builder');

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
                        //url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/reports/88719C9746FB893117148CACBA0CB92E/instances',
                        url: 'http://172.25.142.36:8075/MicroStrategyLibrary/api/reports/12DC624040860B5401F516A2341D95C8/instances',
                        qs: { limit: '1000' },
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
                        qs: { limit: '6' },
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
                        var eventReport = self.buildEventReport(body);
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
        var result = { "records": [], "columns": [] };
        _.forEach(data.result.definition.attributes, function (value, key) {
            result.columns.push(value.name);
        });
        result = self.buildLinearArrayFromTree(data.result.data.root.children, result, [], 0);


        var speech = new Speech();
        speech.say("Here are the event report details").pause("500ms");
        _.forEach(result.records, function (value, key) {
            eventAssignedTo = (value[0].name == "") ? result.columns[0] + " none" : " " + result.columns[0] + " " + value[0].name;
            eventContactAttendees = (value[1].name == "") ? result.columns[1] + " none" : " " + result.columns[1] + " " + value[1].name;
            eventStartArray = value[2].name.split(" ");
            eventEndArray = value[3].name.split(" ");
            eventType = (value[4].name == "") ? result.columns[4] + " none" : result.columns[4] + " " + value[4].name;
            eventSubject = (value[5].name == "") ? result.columns[5] + " none" : " " + result.columns[5] + " " + value[5].name;
            if (typeof value[6] != "undefined") {
                eventLocation = (value[6].name == "") ? result.columns[6] + " none" : " " + result.columns[6] + " " + value[6].name;
            } else {
                eventLocation = result.columns[6] + " none";
            }
            speech.sayAs({ word: key + 1, interpret: 'ordinal' });
            speech.sentence(eventAssignedTo);
            speech.sentence(eventContactAttendees);
            speech.sentence(result.columns[2]);
            speech.sayAs({ word: eventStartArray[0], format: "mdy", interpret: "date" });
            speech.sayAs({ word: eventStartArray[1] + eventStartArray[2], format: "hm12", interpret: "time" });
            speech.sentence(result.columns[3]);
            speech.sayAs({ word: eventEndArray[0], format: "mdy", interpret: "date" });
            speech.sayAs({ word: eventEndArray[1] + eventEndArray[2], format: "hm12", interpret: "time" });
            speech.sentence(eventType);
            speech.sentence(eventSubject);
            speech.sentence(eventLocation).pause("500ms")
        });
        var speechOutput = speech.ssml();
        return speechOutput;
    },
    "buildLinearArrayFromTree": function (records, result, items, index) {
        _.forEach(records, function (value, key) {

            items.push({ "depth": value.depth, "name": value.element.name });
            result.records[index] = items;

            if (typeof value.children != "undefined") {
                self.buildLinearArrayFromTree(value.children, result, items, index);
            } else {
                /*if(typeof value.metrics !== "undefined") {
                    _.forEach(value.metrics, function (v, k) {
                        items.push({mkey:k,mval:v.fv});
                        result.records[index] = items;
                    });
                }*/
            }
            index++;
            items = [];
        });

        return result;
    },
    "buildSalesReport": function (data) {
        console.log("inside helper buildEventReport");
        var speech = new Speech();
        speech.say("Here are the sales report details").pause("500ms")
        _.forEach(data, function (value, key) {
            speech.sayAs({ word: key + 1, interpret: 'ordinal' });
            speech.sentence("Branch Channel is " + value.element.name);
            speech.sentence("Branch City State is " + value.children[0].element.name);
            speech.sentence("Client Full Name is " + value.children[0].children[0].element.name);
            speech.sentence("Firm is " + value.children[0].children[0].children[0].element.name);
            speech.sentence("Product Group is " + value.children[0].children[0].children[0].children[0].element.name);
            speech.sentence("Regional Manager (RM) MF is " + value.children[0].children[0].children[0].children[0].children[0].element.name);
            metrics = value.children[0].children[0].children[0].children[0].children[0].metrics;
            speech.sentence("Branch Rank is " + metrics["Branch Rank"].fv);
            speech.sentence("MF & SMA Current AUM are " + metrics["MF & SMA Current AUM"].fv);
            speech.sentence("MF & SMA Today Sales are " + metrics["MF & SMA Today Sales"].fv);
            speech.sentence("MF & SMA Pr. Month Sales are " + metrics["MF & SMA Pr. Month Sales"].fv);
            speech.sentence("RET Current AUM are " + metrics["RET Current AUM"].fv);
            speech.sentence("and RET Today Sales are " + metrics["RET Today Sales"].fv).pause("500ms");
        });
        var speechOutput = speech.ssml();
        return speechOutput;
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
