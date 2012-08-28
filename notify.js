console.log("hai from notify.js");

var express = require('express'),
	TwilioClient = require('twilio').Client,
	Twiml = require('twilio').Twiml,
	client = new TwilioClient('ACf68e2b63d2b3d88e0d52573b084a2de6', '36078c0b449f1b570b392ee95baf255f', '99.198.122.112'),
	phone = client.getPhoneNumber('+18134341117');


exports.send = function(usfClass) {

	var message = messages.success.call(usfClass);
	
	phone.setup(function() {
		phone.sendSms('+13217507895', message, {}, function() {
			console.log(arguments[0]);
		});
	});

};


var messages = {
	success: function() {
		var msg = "Yay, there are " + this.seats + " seats in " + this.crn + " at " + this.days + " " + this.time + " with " + this.instructor + ". " + this.title + " (" + this.courseNum + ") is " + this.status;
		return msg;
	}
};