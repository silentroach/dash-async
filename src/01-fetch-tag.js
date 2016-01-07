const request = require('request');

module.exports = callback => {
	request({
		url: 'https://api.github.com/repos/caolan/async/tags',
		headers: {
			'user-agent': require('../package.json').description
		}
	}, (err, data) => {
		if (err) {
			callback(err);
			return;
		}

		try {
			callback(null, JSON.parse(data.body)[0].name);
		} catch (e) {
			callback(e);
		}
	});
};