console.log("hai from notify.js");

var express			= require('express'),
	TwilioClient	= require('twilio').Client,
	Twiml			= require('twilio').Twiml,
	keys			= require('./keys'),
	client			= new TwilioClient(
						keys.twilio.sid,
						keys.twilio.auth_token,
						keys.twilio.host),
	phone			= client.getPhoneNumber(keys.twilio.phone),
	logger			= require('./log');

exports.send = function(usfClass) {

	var message = messages.success.call(usfClass);
	
	phone.setup(function() {
		phone.sendSms(keys.twilio.myphone, message, {}, function(res) {
			logger.write(res);
		});
	});

};

var messages = {
	success: function() {
		var msg = this.seats + " seats in " + this.crn + " at " + this.days + " " + this.time + ". " + this.courseNum + " is " + this.status;
		return msg;
	}
};