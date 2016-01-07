require('./style.css');
require('highlight.js/styles/github-gist.css');

const hljs = require('highlight.js/lib/highlight');

hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

[].forEach.call(
	document.querySelectorAll('.language-js'),
	function(node) {
		hljs.highlightBlock(node);
	}
);