define('smokescreen/StyleSheets.Item', [
	'smokescreen/Utils'
], function(Utils) {
	function _createStyleSheet(attrs) {
		var style = document.createElement("style");
		style.appendChild(document.createTextNode("")); // WebKit hack :(

		attrs = attrs || {};
		attrs.rel = 'stylesheet';
		attrs.type = 'text/css';
		attrs.media = attrs.media || 'screen';

		Utils.iterate(attrs, function(value, name) {
			if(value) {
				style.setAttribute(name, value);
			}
		});

		return style;
	}

	function _insertRule(str) {
		if(str) {
			this.__rules.push(str);
		}
	}

	function StyleSheetsItem(attrs, originalNode) {
		this.__style = _createStyleSheet(attrs);
		this.__style.__created = true;
		this.__rules = [];
		this.__originalNode = originalNode;
	}

	function _cloneAttr(attrName, oldNode, newNode) {
		var attr = oldNode.getAttribute(attrName);

		if(attr) {
			newNode.setAttribute(attrName, attr);
		}
	}

	function _insertDelayed() {
		if(this.__rules.length) {
			this.__style.appendChild(document.createTextNode(this.__rules.join("\n")));
		}
	}

	function _getLastStyleParent() {
		var stylesheets = document.styleSheets;

		for(var i = stylesheets.length; i > 0; i--) {
			var style = stylesheets[i - 1];

			if(style && style.ownerNode && style.ownerNode.parentNode) {
				return style.ownerNode.parentNode;
			}
		}
	}

	StyleSheetsItem.prototype = {
		constructor: StyleSheetsItem,

		insert: function() {
			_insertRule.apply(this, arguments);
		},

		insertBlock: function(block, contents) {
			_insertRule.apply(this, [block + '{' + contents + '}']);
		},

		setContent: function(source) {
			this.__style.appendChild(document.createTextNode(source));
		},

		apply: function() {
			if(this.__originalNode && this.__originalNode.parentNode) {
				_cloneAttr('id', this.__originalNode, this.__style);
				this.__originalNode.parentNode.replaceChild(this.__style, this.__originalNode);

			} else {
				(_getLastStyleParent() || document.head).appendChild(this.__style);
			}

			_insertDelayed.apply(this);
		},

		getSheet: function() {
			return this.__style.sheet;
		}
	}

	return StyleSheetsItem;
});
