console.log("hai from log.js");

var fs = require('fs'),
	file = 'log.txt';

exports.log = function(message) {
	console.log(message);
	exports.write(message);
};

exports.write = function(message) {

	if (typeof message === "object") {
		message = "\n" + JSON.stringify(message, null, 4);
	}

	var append = getAppend();
	message = append + message + "\n";

	fs.appendFile(file, message, function(err) {
		if (err) throw err;
	});

};

exports.clear = function(message) {

	fs.writeFile(file, "", function(err) {
		if (err) throw err;
		console.log('The file has been cleared');
		exports.write('Log has been cleared');
	});

};

getAppend = function() {
	return (new Date()).toString() + ": ";
};
