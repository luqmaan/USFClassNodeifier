console.log("hai from controller.js");

var scraper = require('./scraper'),
	notify  = require('./notify'),
	logger  = require('./log'),
	cronJob = require('cron').CronJob,
	config = require('./config');

var job = new cronJob({
	cronTime: '0 1 * * * *',
	onTick: checkSeats,
	start: false,
	timezone: "America/New_York"
});
// job.start();

checkSeats();

function checkSeats() {

	// set up a random delay to prevent a pattern from occurring
	var delay = Math.random() * 3000;
	if (config.debug)
		delay = 0;

	logger.log("===========");
	logger.log("Delaying execution for: " + ( delay / 1000) + " seconds....");

	setTimeout(function() {

		logger.log("Starting scraper.update...");

		// pass options and callback
		// TODO make options actually optional, make options actually do something
		
			// all options are optional, view scraper.js for further options
			scraper.update({
				"status":			"", // for open use O, closed C, all empty
				"subject_acronym":	"MMC", // defaults to any subject
				"course_number":	"4900", // defaults to any course number
				"crn":				"", // just here as an example, defaults to any crn
				"semester":			"" // just here as an example, defaults to fall 2012
			}, function(results) {
				var numNotifications = 0;
				// figure out if the user should be notified
				for (var i in results) {
					// the most important line, determine if the user should be notified
					if (results[i].seats > 0) {
						// notify the user
						logger.log("Notifying for " + results[i].crn);
						if (!config.debug)
							notify.send(results[i]);
						numNotifications++;
					}
				}
				logger.log("-> Made " + numNotifications + " notifications for " + i + " csclasses");
		});
	}, delay);

}