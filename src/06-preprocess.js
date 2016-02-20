'use strict';

module.exports = (tag, ast) => {
	const walker = ast.walker();
	let step;
	let inHeader = false;

	while (step = walker.next()) {
		const node = step.node;

		if (step.entering && 'Heading' === node.type) {
			inHeader = 1 === node.level;

			// appending package version
			if (inHeader) {
				node.firstChild.literal = [
					node.firstChild.literal,
					tag
				].join(' ');
			}

			continue;
		}

		// removing badges
		if (!step.entering
			&& inHeader
			&& 'Link' === node.type
			&& 'Image' === node.firstChild.type
		) {
			node.unlink();
			continue;
		}
	}

	return ast;
};
