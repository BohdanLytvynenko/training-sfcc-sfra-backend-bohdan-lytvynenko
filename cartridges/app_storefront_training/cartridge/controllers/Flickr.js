'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {

    var service = dw.svc.LocalServiceRegistry.createService("FlickrService", {
        createRequest: function(httpService, args) {
            httpService.setRequestMethod("GET");
            httpService.setURL("https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1");
        },
        parseResponse: function(httpService, listOutput) {
            let response = JSON.parse(listOutput.getText());
            return response;
        },
    });

    let result = service.call();
    if (result.status == "OK") {
        let message = result.object;
        res.render("flickr", {
            message: message
        });
        next();
    } else {
        res.json({ error: "error is occured" });
        next();
    }

});

module.exports = server.exports(); 