'use strict';

const methodSections = ['Collections', 'Control Flow', 'Utils'];

module.exports = ast => {
	const toc = {
		Methods: { }
	};

	const methods = toc.Methods;
	const walker = ast.walker();

	let step;
	let currentLink;
	let lastAnchor;
	let inSection = false;
	let inList = false;
	let inItem = false;
	let inParagraph = false;
	let inAliases = false;

	while (step = walker.next()) {
		const node = step.node;

		if (step.entering && 'Heading' === node.type) {
			inSection = 3 === node.level && methodSections.indexOf(node.firstChild.literal) >= 0;

			continue;
		}

		// fixing ellipsis in commonmarks renderer
		if (step.entering
			&& 'Text' === node.type
			&& node.literal.match(/…/)
		) {
			node.literal = node.literal.replace(/…/, '...');
		}

		if (inSection) {
			if ('List' === node.type) {
				inList = step.entering;
				continue;
			} else
			if (inList && 'Paragraph' === node.type) {
				inItem = step.entering;
				continue;
			}

			if (inItem && step.entering) {
				if ('Link' === node.type) {
					currentLink = node.destination;
				} else
				if ('Code' === node.type) {
					methods[node.literal] = currentLink;
				}
			}

			continue;
		}

		if ('HtmlInline' === node.type
			&& node.literal.match(/<a\ name=\"(\w+)\"/)
		) {
			lastAnchor = RegExp.$1;
		}

		if ('Paragraph' === node.type) {
			inParagraph = step.entering;

			if (!inParagraph) {
				inAliases = false;
			}

			continue;
		}

		if (step.entering) {
			if (inParagraph
				&& 'Strong' === node.type
				&& node.firstChild.literal.match(/alias(es)?:/i)
			) {
				inAliases = true;
				continue;
			}

			if (inAliases
				&& 'Code' === node.type
				&& lastAnchor
				&& undefined !== methods[lastAnchor]
			) {
				methods[node.literal] = methods[lastAnchor];
			}
		}
	}

	return toc;
};