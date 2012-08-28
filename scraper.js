console.log("hai from scraper.js");

var querystring = require('querystring'),
	http = require('http'),
	jsdom = require('jsdom'),
	fs = require('fs');
	jquerySource = fs.readFileSync("./jquery.js").toString(),
	logger  = require('./log');

exports.update = function(options, callback) {

		var html = "";
		var post_domain = 'usfonline.admin.usf.edu';
		var post_port = 80;
		var post_path = '/pls/prodss/wp_staff_search_db';

		var post_data = querystring.stringify({
			"P_SEMESTER": "201208",
			"P_SESSION": "",
			"P_CAMPUS": "T",
			"P_DIST": "",
			"P_COL": "",
			"P_DEPT": "",
			"p_status": "", // CHANGE TO O to limit to open
			"p_ssts_code": "",
			"P_CRSE_LEVL": "",
			"P_REF": "",
			"P_SUBJ": "CDA",
			"P_NUM": "3201",
			"P_TITLE": "Lab",
			"P_CR": "",
			"p_day_x": "no_val",
			"p_day": "no_val",
			"P_TIME1": "",
			"P_INSTRUCTOR": "",
			"P_UGR": ""
		});

		var post_options = {
			host: post_domain,
			port: post_port,
			path: post_path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		logger.log("Making request...");

		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				html += chunk;
			});
			res.on('end', function() {
				logger.log("Request ended...");
				return parse(html, callback);
			});
		});

		// write parameters to post body
		post_req.write(post_data);
		post_req.end();

};

var parse = function(usfHTML, callback) {

	logger.log("Parsing results...");
	
	// prepare results array
	var results = [];

	// set up jquery
	jsdom.env({
		html: usfHTML,
		src: [jquerySource],
		done: function(errors, window) {
			var $ = window.$;

			// find the number of seats and crn
			$("table[border=1] tr").not("[align='LEFT']").each(function() {

				var usfClass = {
					crn : $(this).find(":nth-child(4)").text(),
					courseNum : $(this).find(":nth-child(5)").text(),
					title : $(this).find(":nth-child(8)").text(),
					status : $(this).find(":nth-child(11)").text(),
					seats : $(this).find(":nth-child(13)").text(),
					days : $(this).find(":nth-child(16)").text(),
					time : $(this).find(":nth-child(17)").text(),
					instructor : $(this).find(":nth-child(20)").text()
				};

				logger.log("Found class " + usfClass.crn);
				
				// add to results
				results.push(usfClass);
			});

			// execute callback finally
			callback(results);
		}
	});

};