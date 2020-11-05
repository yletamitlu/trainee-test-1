const removeStyle = (style) => {
	if (style) {
		try {
			style.__style.parentNode.removeChild(style.__style);
		} catch (e) {
		}
	}
};

const insertStyle = (locator, sheet) => {
	return locator.insertSheet(sheet);
};

export const updateStyle = (style, locator, sheet) => {
	removeStyle(style);
	return insertStyle(locator, sheet);
};
