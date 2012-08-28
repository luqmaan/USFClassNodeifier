console.log("hai from controller.js");

var scraper = require('./scraper'),
	notify  = require('./notify'),
	logger  = require('./log'),
	cronJob = require('cron').CronJob;

var job = new cronJob({
	cronTime: '0 1 * * * *',
	onTick: checkSeats,
	start: false,
	timezone: "America/New_York"
});
job.start();

checkSeats();

function checkSeats() {

	// set up a random delay to prevent a pattern from occurring
	var randomDelay = Math.random() * 30000;

	logger.log("===========");
	logger.log("Delaying execution for: " + randomDelay);

	setTimeout(delay, function() {

		logger.log("Now running checkseats");

		// pass options and callback
		// TODO make options actually optional, make options actually do something
		
		scraper.update({}, function(results) {

			var numNotifications = 0;
			// figure out if the user should be notified
			for (var i in results) {
				if (results[i].seats < 0) {
					// notify the user
					logger.log("Notifying for " + results[i].crn);
					notify.send(results[i]);
					numNotifications++;
				}
			}
			// nobody was notifed
			if (numNotifications === 0) {
				logger.log("-> Nothing to notify (" + i + "th class)");
			}

		});
	});

}