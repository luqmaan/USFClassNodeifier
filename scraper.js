console.log("hai from scraper.js");

var fs				= require('fs'),
	http			= require('http'),
	https           = require('https'),
	jsdom			= require('jsdom'),
	querystring		= require('querystring'),
	jquerySource	= fs.readFileSync("./jquery.js").toString(),
	logger          = require('./log');

exports.update = function(opts, callback) {

	var post_domain	= 'usfonline.admin.usf.edu';
	var post_port	= 443;
	var post_path	= '/pls/prodss/wp_staff_search_db';

	// defaults
	var options = {
		"P_SEMESTER": "201208",
		"P_SESSION": "",
		"P_CAMPUS": "T",
		"P_DIST": "",
		"P_COL": "",
		"P_DEPT": "",
		"p_status": "",
		// CHANGE TO O to limit to open
		"p_ssts_code": "",
		"P_CRSE_LEVL": "",
		"P_REF": "",
		"P_SUBJ": "",
		"P_NUM": "",
		"P_TITLE": "",
		"P_CR": "",
		"p_day_x": "no_val",
		"p_day": "no_val",
		"P_TIME1": "",
		"P_INSTRUCTOR": "",
		"P_UGR": ""
	};

	// merge passed options and defaults
	// http://stackoverflow.com/questions/896043/how-can-i-merge-2-javascript-objects-populating-the-properties-in-one-if-they-d
	// TODO this will no longer be valid when options contains objects
	for (var prop in options) {
		if (prop in opts)
			options[prop] = opts[prop];
	}

	// rename user-friendly opts back to their correct name in options
	for (var i in opts) {
		if (opts[i] !== "") {
			switch (i) {
				case "status":
					options["p_status"] = opts[i];
					break;
				case "subject_acronym":
					options["P_SUBJ"] = opts[i];
					break;
				case "course_number":
					options["P_NUM"] = opts[i];
					break;
				case "crn":
					options["P_REF"] = opts[i];
					break;
				case "semester":
					options["P_SEMESTER"] = opts[i];
					break;
			}
		}
	}

	console.log(options);

	// stringify the POST data
	var post_data = querystring.stringify(options);

	// prepare  the options
	var post_options = {
		host:	post_domain,
		port:	post_port,
		path:	post_path,
		method:	'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};

	// make the request
	logger.log("Making request...");
	var html = "";
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		// as data is received, save it to the html
		res.on('data', function(chunk) {
			html += chunk;
		});
		// when finished receiving data, parse it (and don't forget the callback)
		res.on('end', function() {
			logger.log("Request ended...");
			logger.writeFile(html, ".html");
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


		// set up the html with jsdom
		// so we can just use easy jquery selector's to find the data
		jsdom.env({
			html: usfHTML,
			src: [jquerySource],
			done: function(errors, window) {
				var $ = window.$;

				// find the number of seats and crn
				$("table[border=1] tr").not("[align='LEFT']").each(function() {

					var usfClass = {
						crn:		$(this).find(":nth-child(4)").text(),
						courseNum:	$(this).find(":nth-child(5)").text(),
						title:		$(this).find(":nth-child(8)").text(),
						status:		$(this).find(":nth-child(11)").text(),
						seats:		$(this).find(":nth-child(13)").text(),
						days:		$(this).find(":nth-child(16)").text(),
						time:		$(this).find(":nth-child(17)").text(),
						instructor: $(this).find(":nth-child(20)").text()
					};

					logger.log("Found class " + usfClass.crn);
					console.log (usfClass);

					// add to results
					results.push(usfClass);
				});

				// execute callback finally
				callback(results);
			}
		});

	};
