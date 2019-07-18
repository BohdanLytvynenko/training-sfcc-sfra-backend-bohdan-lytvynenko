var server = require('server');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {

    var BasketMgr = require('dw/order/BasketMgr');

    var priceLimit = dw.system.Site.getCurrent().getCustomPreferenceValue("priceLimit");

    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket.totalGrossPrice > priceLimit) {
        var isExceed = true;
    }

    res.setViewData({ 
        isExceed: isExceed,
        priceLimit: priceLimit
    });

    return next();
});

module.exports = server.exports(); 