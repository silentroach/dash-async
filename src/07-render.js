const fs = require('fs');

const commonmark = require('commonmark');

module.exports = (indexFilePath, tag, ast, callback) => {
	const content = new commonmark.HtmlRenderer({
		smart: false
	}).render(ast);

	fs.writeFile(
		indexFilePath,
		`<html><!-- Online page at https://github.com/caolan/async/blob/${tag}/README.md -->
<head>
	<link href="bundle.css" rel="stylesheet" />
	<title>Async.js documentation</title>
</head>
<body>
	${content}
	<script src="bundle.js"></script>
</body>
</html>`,
		callback
	);
};