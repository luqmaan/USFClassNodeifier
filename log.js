console.log("hai from log.js");

var fs		= require('fs'),
	file	= 'log.txt';

// get the message to be appended to the beginning of the line
var append = function() {
	return (new Date()).toString() + ": ";
};

// write the message to the log file
exports.write = function(message) {

	if (typeof message === "object") {
		message = "\n" + JSON.stringify(message, null, 4);
	}

	message = append() + message + "\n";

	fs.appendFile(file, message, function(err) {
		if (err) throw err;
	});

};

// save some data to a file
exports.writeFile = function(data) {

	// save text files unless specified otherwise
	var extension = arguments[1] || ".txt";

	// give the file a name like 'Tue-Aug-28-2012-22:46:52-GMT-0400-(EDT).html'
	var fname = "log-data/" + (new Date()).toString().replace(/ /g,"-") + extension;
	fs.writeFile(fname, data, function() {
		exports.log("Saved HTML to " + fname);
	});
};

// in addition to writing to the log file, perform console.log
exports.log = function(message) {
	console.log(message);
	exports.write(message);
};

// clear the log file
exports.clear = function(message) {

	fs.writeFile(file, "", function(err) {
		if (err) throw err;
		console.log('The file has been cleared');
		exports.write('Log has been cleared');
	});

};
