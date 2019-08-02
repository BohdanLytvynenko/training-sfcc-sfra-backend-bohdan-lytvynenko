'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {

    var searchQuery = 
            '?refine=cgid=' + req.querystring.cgid +
            ',brand=' + req.querystring.brand +
            '&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    var service = dw.svc.LocalServiceRegistry.createService("OcapiService", {
            
        createRequest: function(httpService, args) {
            httpService.setRequestMethod("GET");
            httpService.setURL(httpService.getURL() + searchQuery);
        },
        parseResponse: function(httpService, listOutput) {
            var response = JSON.parse(listOutput.getText());
            var productsIds = response.hits.map(function(product) {
                return product.product_id
            });
            return productsIds;
        },
    });

    var result = service.call();
    if (result.status == "OK") {
        var sonyProducts = result.object;
        res.render("ocapi", {
            sonyProducts: sonyProducts
        });
        next();
    } else {
        res.json({ error: "error is occured" });
        next();
    }

});

module.exports = server.exports();  