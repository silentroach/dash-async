const commonmark = require('commonmark');

module.exports = data => {
	return new commonmark.Parser().parse(data);
};