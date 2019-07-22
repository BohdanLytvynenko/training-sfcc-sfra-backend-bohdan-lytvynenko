
'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var actionUrl = URLUtils.url('NewsletterSubscr-HandleForm');

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
	var Mail = require('dw/net/Mail');
	var HashMap = require('dw/util/HashMap');
	var Resource = require('dw/web/Resource');
	var Template = require('dw/util/Template');
	var Site = require('dw/system/Site');
	var couponCode;

	var myCoupon = CouponMgr.getCoupon('20_off');
	
	Transaction.wrap(function() {
		try {
			// creating custom object
			var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscr", newsletterForm.email.htmlValue.toString());	
			customObjectInstance.custom.firstName = newsletterForm.firstname.htmlValue.toString();		
			customObjectInstance.custom.lastName = newsletterForm.lastname.htmlValue.toString();

			couponCode = myCoupon.getNextCouponCode();
			customObjectInstance.custom.couponCode = couponCode;

			// sending message with promocode
			var userObjectForEmail = {
				firstNameField: newsletterForm.firstname.htmlValue.toString(),
				lastNameField: newsletterForm.lastname.htmlValue.toString(),
				couponCode: couponCode
			};

			var newsletterEmail = new Mail();
			var context = new HashMap();

			Object.keys(userObjectForEmail).forEach(function (key) {
				context.put(key, userObjectForEmail[key]);
			});

			newsletterEmail.addTo(newsletterForm.email.htmlValue.toString());
			newsletterEmail.setSubject(Resource.msg('subject.newsletter.email', 'mail', null));
			newsletterEmail.setFrom(
					Site.current.getCustomPreferenceValue('customerServiceEmail')
					|| 'no-reply@salesforce.com');

			var template = new Template('newsletterMail');
			var content = template.render(context).text;
			newsletterEmail.setContent(content, 'text/html', 'UTF-8');
			newsletterEmail.send();

			res.render('home/homePage');
		}
		catch(e) {
			res.render('newsletterError');
		}
	});

	next();
});

module.exports = server.exports();