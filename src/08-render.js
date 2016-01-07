const fs = require('fs');

const commonmark = require('commonmark');

module.exports = (indexFilePath, ast, callback) => {
	const content = new commonmark.HtmlRenderer().render(ast);

	fs.writeFile(
		indexFilePath,
		`<html>
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