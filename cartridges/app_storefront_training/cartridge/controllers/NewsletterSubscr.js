
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
	
	return next();
});

server.post('HandleForm', function (req, res, next) {  // form gets validated here
	var newsletterForm = server.forms.getForm('newsletter'); // name the xml!
	var Transaction = require('dw/system/Transaction');
	var CouponMgr = require('dw/campaign/CouponMgr');

	var formErrors = require('*/cartridge/scripts/formErrors');
	var couponCode;

	var myCoupon = CouponMgr.getCoupon('20_off');

	var redirectUrl = URLUtils.url("Home-Show").toString();

	var resultFields = {
        firstName: newsletterForm.firstname.value,
        lastName: newsletterForm.lastname.value,
        email: newsletterForm.email.value
	};
	
	if (newsletterForm.valid) {
		res.setViewData(resultFields);

		res.json({
			success: true,
			redirectUrl: redirectUrl
		});

		Transaction.wrap(function() {
			try {
				// creating custom object
				var customObjectInstance = CustomObjectMgr.createCustomObject("NewsletterSubscr", newsletterForm.email.htmlValue.toString());	
				customObjectInstance.custom.firstName = newsletterForm.firstname.htmlValue.toString();		
				customObjectInstance.custom.lastName = newsletterForm.lastname.htmlValue.toString();
	
				couponCode = myCoupon.getNextCouponCode();
				customObjectInstance.custom.couponCode = couponCode;
			}
			catch(e) {
				res.render('newsletterError');
			}
		});

	} else {
        res.json({
            success: false,
            fields: formErrors.getFormErrors(newsletterForm)
        });
	}

	return next();
	
});

module.exports = server.exports();