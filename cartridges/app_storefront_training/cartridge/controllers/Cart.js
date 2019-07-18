var server = require('server');
server.extend(module.superModule);

server.append('AddProduct', function (req, res, next) {
    var Mail = require('dw/net/Mail');
    var Template = require('dw/util/Template');
    var Site = require('dw/system/Site');
    var HashMap = require('dw/util/HashMap');
    var Collection = require('dw/util/Collection');
    var Resource = require('dw/web/Resource');
    var BasketMgr = require('dw/order/BasketMgr');

    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var productsArray = currentBasket.productLineItems.toArray();
    var lastAddedProduct = productsArray[productsArray.length - 1];

    var userObj = req.currentCustomer;
    var userName = userObj.profile.firstName;
    var userEmail = userObj.profile.email;

    var userObjectForEmail = {
        userName: userName,
        userEmail: userEmail,
        lastAddedProductName: lastAddedProduct.lineItemText,
        lastAddedProductPrice: lastAddedProduct.basePrice
    };

    var productAddedEmail = new Mail();
    var context = new HashMap();

    Object.keys(userObjectForEmail).forEach(function (key) {
        context.put(key, userObjectForEmail[key]);
    });

    productAddedEmail.addTo(userEmail);
    productAddedEmail.setSubject(Resource.msg('subject.productAdded.email', 'mail', null));
        productAddedEmail.setFrom(
            Site.current.getCustomPreferenceValue('customerServiceEmail')
            || 'no-reply@salesforce.com');

    var template = new Template('mail/mailMessage');
    var content = template.render(context).text;
    productAddedEmail.setContent(content, 'text/html', 'UTF-8');
    productAddedEmail.send();

    return next();
});

module.exports = server.exports();