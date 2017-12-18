/**
 * Created by Andy on 2/15/2017.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var passport = require("passport");

var app = express();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));
app.use(fileUpload());

app.use(express.static(__dirname + '/public'));

app.use('/api/web3',require('./src/server/index'));
app.use('/api/auth', require('./src/server/auth'));
app.use('/api/media', require('./src/server/media'));
app.use('/api/assetsKey', require('./src/server/assets_key'));
app.use('/api/confirmKey', require('./src/server/confirm_key'));
app.use('/api/timeline', require('./src/server/timeline'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

app.listen(8080);

module.exports = app;
