'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var HTTPClient = require('dw/net/HTTPClient');

server.get('Start', function (req, res, next) {

    res.render('facebook');

    next();

});

server.get('Show', function (req, res, next) {

    var access_token = req.querystring.code; 
    var httpClient = new HTTPClient();
    httpClient.open('GET', dw.system.Site.getCurrent().getCustomPreferenceValue('facebookGetToken') + access_token)
    httpClient.setTimeout(3000);
    httpClient.send();

    var token = JSON.parse(httpClient.text).access_token;
    httpClient.open('GET', dw.system.Site.getCurrent().getCustomPreferenceValue('facebookGetInfo') + token);
    httpClient.setTimeout(3000);
    httpClient.send();
    var info = JSON.parse(httpClient.text);

    res.render('facebook', {
        info: info
    });

    next();

});

module.exports = server.exports();