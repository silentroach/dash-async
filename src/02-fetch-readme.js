const request = require('request');

module.exports = (tag, callback) => {
	request({
		url: `https://raw.githubusercontent.com/caolan/async/${tag}/README.md`,
		headers: {
			'user-agent': require('../package.json').description
		}
	}, (err, response) => {
		callback(err, !err ? response.body : null);
	});
};