console.log("hai from controller.js");

var scraper = require('./scraper'),
	notify = require('./notify');


var cronJob = require('cron').CronJob;
new cronJob('1 0 * * *', checkSeats, true, true);
checkSeats();

function checkSeats() {

	console.log("Running checkseats");

	scraper.update({}, function(results) {
		for (var i in results) {
			if (results[i].seats === 0) {
				console.log(results[i].crn);
				notify.send(results[i]);
			}
		}
	});

}

// expects an class object
// console.log(status);
