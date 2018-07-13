var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(session({ secret: 'this-is-a-secret-token',resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
var routes = require('./routes');
var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(routes);
app.listen(port, function () {
	console.log("Application started listening port " + port);
});


