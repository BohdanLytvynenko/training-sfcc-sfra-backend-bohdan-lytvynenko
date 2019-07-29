'use strict';

var formValidation = require('../components/formValidation');

$(document).ready(function () {
    $('form.newsletter-form .js-save-subscription').on('click', function (e) {
        var form = $(this).closest('form');
        alert('Please click OK to confirm your subsctiption');
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: form.serialize(),
            success: function(data) {
                form.spinner().stop();

                if (data.success) {
                    location.href = data.redirectUrl;
                    form.spinner.stop();
                } else {
                    formValidation(form, data);
                }
            },
            error: function(data) {
                form.spinner().stop();
            }
        });
        return false;
    });
});