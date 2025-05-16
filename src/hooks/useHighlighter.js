export default function useHighlighterControl() {
	const highlightById = (targetId) => {
		const target = document.getElementById(targetId);
		if (!target) {
			console.warn(`[Highlighter] No element found with id '${targetId}'`);
			return;
		}
		target.classList.add("highlighted");
	};

	const clearById = (targetId) => {
		const target = document.getElementById(targetId);
		if (!target) return;
		target.classList.remove("highlighted");
		target.classList.remove("regex-highlighted");
	};

	const highlightByRegex = ({
		containerElement,
		regexString,
		matchIndex = 0,
		highlightClassName = "regex-highlighted",
	}) => {
		if (!containerElement) {
			console.warn(
				"[Highlighter] Container element not provided for regex highlight."
			);
			return { createdSpans: [], modifiedElements: [] };
		}

		const regex = new RegExp(regexString, "g");
		let fullText = "";
		const textNodesInfo = [];
		const walker = document.createTreeWalker(
			containerElement,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);

		let node;
		while ((node = walker.nextNode())) {
			if (
				node.parentElement.tagName === "SCRIPT" ||
				node.parentElement.tagName === "STYLE"
			) {
				continue;
			}
			if (node.parentElement.classList.contains(highlightClassName)) {
				// If parent is already highlighted, we might need to skip its text,
				// or the clear function needs to be robust. For now, let's include its text
				// but be careful when wrapping.
			}
			textNodesInfo.push({ node, startOffsetInFullText: fullText.length });
			fullText += node.nodeValue;
		}

		let match;
		let currentMatchIndex = 0;
		let foundMatchDetails = null;

		while ((match = regex.exec(fullText)) !== null) {
			if (currentMatchIndex === matchIndex) {
				foundMatchDetails = {
					startIndex: match.index,
					endIndex: match.index + match[0].length,
					matchedText: match[0],
				};
				break;
			}
			currentMatchIndex++;
		}

		if (!foundMatchDetails) {
			console.warn(
				`[Highlighter] Regex match not found for index ${matchIndex}:`,
				regexString
			);
			return { createdSpans: [], modifiedElements: [] };
		}

		const createdSpans = [];
		const modifiedElements = [];

		for (let i = 0; i < textNodesInfo.length; i++) {
			const { node: textNode, startOffsetInFullText: nodeStartOffset } =
				textNodesInfo[i];
			const nodeEndOffset = nodeStartOffset + textNode.nodeValue.length;

			if (
				nodeEndOffset > foundMatchDetails.startIndex &&
				nodeStartOffset < foundMatchDetails.endIndex
			) {
				const parent = textNode.parentElement;
				if (parent.dataset.role === "interactable") {
					const parentTextContent = parent.textContent.trim();
					if (
						foundMatchDetails.matchedText === parentTextContent &&
						foundMatchDetails.startIndex <= nodeStartOffset &&
						foundMatchDetails.endIndex >= nodeEndOffset &&
						!modifiedElements.includes(parent)
					) {
						parent.classList.add(highlightClassName);
						modifiedElements.push(parent);
						continue;
					}
				}

				if (modifiedElements.includes(parent)) continue;

				const span = document.createElement("span");
				span.className = highlightClassName;

				const range = document.createRange();
				const localStartOffset = Math.max(
					0,
					foundMatchDetails.startIndex - nodeStartOffset
				);
				const localEndOffset = Math.min(
					textNode.nodeValue.length,
					foundMatchDetails.endIndex - nodeStartOffset
				);

				if (localStartOffset >= localEndOffset) continue;

				range.setStart(textNode, localStartOffset);
				range.setEnd(textNode, localEndOffset);

				if (
					textNode.parentElement.classList.contains(highlightClassName) &&
					textNode.parentElement.tagName === "SPAN"
				) {
					continue;
				}

				try {
					const clonedContent = range.extractContents();
					span.appendChild(clonedContent);
					range.insertNode(span);
					createdSpans.push(span);
				} catch (e) {
					console.error(
						"[Highlighter] Error wrapping range:",
						e,
						textNode,
						localStartOffset,
						localEndOffset
					);
				}
			}
		}
		return { createdSpans, modifiedElements };
	};

	const clearRegexHighlights = (
		containerElement,
		highlightClassName = "regex-highlighted"
	) => {
		if (!containerElement) return;

		const modified = containerElement.querySelectorAll(
			`[data-role="interactable"].${highlightClassName}`
		);
		modified.forEach((el) => {
			el.classList.remove(highlightClassName);
		});

		const created = containerElement.querySelectorAll(
			`span.${highlightClassName}`
		);
		created.forEach((span) => {
			const parent = span.parentNode;
			if (parent) {
				if (
					!(
						parent.dataset.role === "interactable" &&
						parent.classList.contains(highlightClassName)
					)
				) {
					while (span.firstChild) {
						parent.insertBefore(span.firstChild, span);
					}
					parent.removeChild(span);
					parent.normalize();
				} else if (!span.hasChildNodes()) {
					parent.removeChild(span);
					parent.normalize();
				}
			}
		});
	};

	return {
		highlightById,
		clearById,
		highlightByRegex,
		clearRegexHighlights,
	};
}
