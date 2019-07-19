
'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var actionUrl = URLUtils.url('NewsletterSubscr-HandleForm');
// var CustomObjectMgr = require('dw/object/CustomObjectMgr');

server.get('Start', function (req, res, next) {
	var newsletterForm = server.forms.getForm('newsletter'); // name the xml!
	newsletterForm.clear();  // initialization
	res.render('newsletter', {
		actionUrl: actionUrl,
		newsletterForm: newsletterForm
	});
	
	next();
});

server.post('HandleForm', function (req, res, next) {  // form gets validated here
	var newsletterForm = server.forms.getForm('newsletter'); // name the xml!
	var Transaction = require('dw/system/Transaction');
	var CouponMgr = require('dw/campaign/CouponMgr');
	var myCoupon = CouponMgr.getCoupon('20_off');
	// var couponCode = myCoupon.getNextCouponCode();
	
	Transaction.wrap(function() {
		var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscr", newsletterForm.email.htmlValue.toString());	
		customObjectInstance.custom.firstName = newsletterForm.firstname.htmlValue.toString();		
		customObjectInstance.custom.lastName = newsletterForm.lastname.htmlValue.toString();		
		customObjectInstance.custom.couponCode = myCoupon.getNextCouponCode();
	});

	// var userObjectForEmail = {
    //     firstNameField: firstNameField,
    //     lastNameField: lastNameField,
    //     couponCode: couponCode
    // };

    // var newsletterEmail = new Mail();
    // var context = new HashMap();

    // Object.keys(userObjectForEmail).forEach(function (key) {
    //     context.put(key, userObjectForEmail[key]);
    // });

    // newsletterEmail.addTo(emailField);
    // newsletterEmail.setSubject(Resource.msg('subject.productAdded.email', 'mail', null));
	// newsletterEmail.setFrom(
    //         Site.current.getCustomPreferenceValue('customerServiceEmail')
    //         || 'no-reply@salesforce.com');

    // var template = new Template('newsletterMail');
    // var content = template.render(context).text;
    // newsletterEmail.setContent(content, 'text/html', 'UTF-8');
    // newsletterEmail.send();

	// check for any other form actions
	// otherwise...
	res.render('/home/homePage');
	next();
});

module.exports = server.exports();