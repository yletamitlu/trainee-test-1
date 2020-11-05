define('smokescreen/StyleSheets', [
	'smokescreen/StyleSheets.Item',
	'smokescreen/Utils'
], function(StyleSheetsItem, Utils) {

	var justOneSelector = false;

	function _convert(_selectors, selector) {
		var convertedSelector = _selectors(selector);

		return justOneSelector || (convertedSelector === selector) ?
			convertedSelector :
			convertedSelector + ',' + selector;
	}

	function _propertiesToString(block) {
		var result = [];

		Utils.iterate(block, function (value, name) {
			result.push(name + ':' + value + ';');
		});

		return '{' + result.join('\n') + '}';
	}

	function _getHref(sheet) {
		var href;

		if(sheet.ownerNode) {
			href = sheet.ownerNode.href || sheet.ownerNode.getAttribute('x-href');
			href = (href || '').replace(/^https:/, '');
		}

		return href;
	}

	return {
		setup: function (conf) {
			if (conf) {
				if (typeof conf.justOneSelector === 'boolean') {
					justOneSelector = conf.justOneSelector;
				}
			}
		},

		remove: function(links) {
			links = (links || []).map(function(url) {
				return (url || '').replace(/^https:/, '');
			});

			if(links.length) {
				var toRemove = [];
				Utils.iterate(document.styleSheets, function(sheet) {
					var url = _getHref(sheet);

					if(url && links.indexOf(url) !== -1) {
						toRemove.push(sheet);
					}
				});

				for(var i = toRemove.length - 1; i >=0; i--) {
					var sheet = toRemove[i];
					sheet.ownerNode.parentNode.removeChild(sheet.ownerNode);
				}
			}
		},

		insert: function(config, _selectors) {
			var sheet = new StyleSheetsItem({});
			var _bindConvert = _convert.bind(null, _selectors);
			var constructRule = function (selector, block ) {
				return _bindConvert(selector) + _propertiesToString(block);
			};

			var insertRule = function(block, selector) {
				// Содержит блочные @-rule? Итерируемся по вложенному объекту
				if (/@(media|supports|document|page|keyframes|font-feature-values)/.test(selector)) {
					var blockRules = [];
					var createBlockRule = function (block, selector) {
						blockRules.push(constructRule(selector, block));
					};

					Utils.iterate(block, createBlockRule);

					sheet.insertBlock(selector, blockRules.join(''));
				} else {
					sheet.insert(constructRule(selector, block));
				}
			};

			Utils.iterate(config, insertRule);

			sheet.apply();

			return sheet;
		}
	}
});
