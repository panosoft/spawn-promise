var suspend = require('suspend');
var childProcess = require('child_process');

var exitCodes = {
	1: 'Uncaught Fatal Exception',
	3: 'Internal JavaScript Parse Error',
	4: 'Internal JavaScript Evaluation Failure',
	5: 'Fatal Error',
	6: 'Non-function Internal Exception Handler',
	7: 'Internal Exception Handler Run-Time Failure',
	9: 'Invalid Argument',
	10: 'Internal JavaScript Run-Time Failure',
	12: 'Invalid Debug Argument'
};
var isEmpty = function (object) {
	return Object.keys(object).length === 0;
};
/**
 * Spawn a child process and receive output via a Promise interface.
 *
 * @params {String} command
 * 	Command to spawn.
 * @params {String[]} args
 *  Array of arguments to run command with.
 * @params {String} input
 * 	Input to pass command via stdin.
 *
 * @returns {Promise}
 * 	Resolved with buffer of stdout
 * 	Rejected with error
 */
var spawn = suspend.promise(function * (command, args, input) {
	var child = childProcess.spawn(command, args);
	child.stderr.setEncoding('utf8');

	// TODO handle sig events? (sigint, etc.)

	// Handle errors
	var errors = {};
	child.on('error', function (error) { // error object
		errors.spawn = error;
	});
	child.stdin.on('error', function (error) { // error object
		errors.stdin = error;
	});
	child.stderr.on('error', function (error) { // error object
		errors.stderr = error;
	});
	child.stdout.on('error', function (error) { // error object
		errors.stdout = error;
	});
	child.stderr.on('data', function (data) { // error message
		if (!errors.process) errors.process = '';
		errors.process += data;
	});

	// Capture output
	var stdoutBuffers = [];
	child.stdout.on('data', function (data) {
		stdoutBuffers.push(data);
	});

	// Return
	var resume = suspend.resume();
	child.on('close', function (code, signal) {
		if (code !== 0) {
			errors.exit = new Error('Command failed: ' + code + ': ' + exitCodes[code]);
		}
		if (!isEmpty(errors)) {
			return resume(errors);
		}
		return resume(null, Buffer.concat(stdoutBuffers));
	});

	return yield child.stdin.end(input);
});

module.exports = spawn;