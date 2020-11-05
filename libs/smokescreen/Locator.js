define('smokescreen/Locator', [
	'smokescreen/StyleSheets',
	'smokescreen/Welter',
	'smokescreen/Utils',
	'smokescreen/Cid'
],
function (StyleSheets, Welter, Utils, cid) {
	'use strict';

	// Это мини - реализация $.data
	// ключ для хранения данных в элементах
	var __cid = cid()
	// порядковый номер элемента, который записывается в ключ
	var __uid = 0;

	var __cache = {
		names: {},
		reverse: {},
		wraps: {}
	};

	// {uid элемента (т. е. context'а): cache}
	var __data = {};

	var ENABLE = false;

	var __mathesOptions = [];
	var RE_FILTER;
	var TRANSLATE_ALL = false;

	var RE_SELECTOR = /([@#:.]*)([\w$-]+)/gi;

	var OPTIONS = {};


	/**
	 * Дефолтные селекторы для рандомизации
	 * @type {[string]}
	 */
	var DEF_RAND_PROPS = (function(){
		// базовые свойства
		var base = ['top', 'right', 'bottom', 'left'];
		// свойства которые надо дополнительно дополнить базовыми (margin-top etc..)
		var extendable = ['margin', 'padding'];
		// сюда собираем результат
		var result = [
			'height', 'width',
			'max-width', 'max-height',
			'min-height', 'min-width'
		];

		// генерим свойства из extendable и base селекторов (margin-top etc..)
		extendable.forEach(function(prop){
			base.forEach(function(side){
				result.push(prop + '-' + side)
			});
		});

		// добавляем в результат все
		return result.concat(base, extendable)
	})();

	/**
	 * @constructor
	 * @param {Object} options
	 */
	function Locator (options) {
		_setup(options);
	}

	function _updateSheets(links, errorHook) {
		if(ENABLE && links) {
			StyleSheets.update(links, _selectors, errorHook, OPTIONS);
		}
	}

	function _insertSheet(sheet) {
		return StyleSheets.insert(sheet, _selectors);
	}


	function _setup(options, errorHook) {
		options = Utils.extend({}, OPTIONS, options || {});
		OPTIONS = options;

		if(!!options.enable) {
			ENABLE = true;
		}

		if(ENABLE) {
			if (typeof options.translateAll === 'boolean') {
				TRANSLATE_ALL = options.translateAll;
			}
			if(options.match && options.match instanceof Array && options.match.length > 0) {
				__mathesOptions = __mathesOptions.concat(options.match);
				RE_FILTER = new RegExp('^(' + __mathesOptions.join('|') + ')');
			}
		}

		StyleSheets.setup(options.styleSheetsOptions);

		if(options.randomize) {
			options.randomize = options.randomize === true ? DEF_RAND_PROPS : options.randomize;
		}

		if(options.links) {
			_updateSheets(options.links, errorHook);
		}

		if(options.sheet) {
			_insertSheet(options.sheet);
		}
	}

	function _key(value, filterValue) {
		return (filterValue ? filterValue + '@@@' : '') + value;
	}

	function _transformStr(value, filterValue) {
		var key =  _key(value, filterValue);
		var name = __cache.names[key];

		if(!name && (ENABLE && (TRANSLATE_ALL || RE_FILTER && RE_FILTER.test(filterValue || value)))) {
			name = cid();
			__cache.names[key] = name;
			__cache.reverse[name] = value;
		}

		return name || value;
	}

	function _transform(value, filterValue) {
		var valObj = _splitElemMod(value);

		if(filterValue) {
			return _transformStr(valObj.elem, filterValue) + (valObj.mod ? '_' + _transformStr(valObj.mod, filterValue) : '')

		} else {
			return _transformStr(valObj.elem) + (valObj.mod ? '_' + _transformStr(valObj.mod, valObj.elem) : '')

		}
	}

	function _splitElemMod(value) {
		var m = (value ? '' + value : '').match(/^(.*?[^_])(_([^_]+))?$/);
		var modifier;

		if(m) {
			value = m[1];
			modifier = m[3];
		}
		return { elem: value, mod: modifier };
	}

	/**
	 * Метод возвращает строку селекторов таблицы стилей c примененной трансформацией
	 *
	 * Пример:
	 *
	 * let selector = 'div div ::selection div:hover:after div .foo .bar.baz .bar.bar#y#z-_$3 div .baz, .foo, .bar baz';
	 *
	 * transform(selector, value => {
	 *     return value.toUpperCase();
	 * });
	 *
	 * Вернет:
	 *
	 * div div ::selection div:hover:after div .1111 .1111.1111 .1111.1111#1111#1111 div .1111, .1111, .1111 baz
	 *
	 * Ограничения:
	 * Трансформация не примется к именам элементов, псевдоселекторам и псевдоклассам
	 *
	 * @param {string} selector
	 * @param {Function} transform
	 * @returns {string}
	 */
	function _selectors(selector) {
		return selector.replace(RE_SELECTOR, function (text, prefix, name) {
			if (!prefix || /:/.test(prefix)) {
				return text;
			}

			return prefix + _transform(name);
		});
	}

	function _lookup(name, filterValue) {
		var valObj = _splitElemMod(name);

		if(filterValue) {
			return (__cache.names[_key(valObj.elem, filterValue)] || valObj.elem) + (valObj.mod ? '_' + (__cache.names[_key(valObj.mod, filterValue)] || valObj.mod): '');

		} else {
			return (__cache.names[valObj.elem] || valObj.elem) + (valObj.mod ? '_' + (__cache.names[_key(valObj.mod, valObj.elem)] || valObj.mod): '');
		}
	}

	function _splitCallback(value, callback, filterValue) {
		return (value || '').toString().split(/\s+/).map(function(name) {
			return callback(name, filterValue);

		}).join(' ');
	}

	function _reverse(name) {
		var valObj = _splitElemMod(name);

		return (__cache.reverse[valObj.elem] || valObj.elem) + (valObj.mod ? '_' + (__cache.reverse[valObj.mod] || valObj.mod): '');
	}

	Locator.prototype = {
		constructor: Locator,

		setup: _setup,

		/**
		 * Метод возвращает селектор
		 *
		 * @public
		 * @param {string} value
		 * @param {string}
		 */
		selector: function(selector, justOneSelector) {
			var newSelector = _selectors(selector);

			if(justOneSelector || selector == newSelector) {
				return newSelector;
			} else {
				return newSelector + ', ' + selector;
			}
		},

		transform: function (value, filterValue) {
			return _splitCallback(value, _transform, filterValue);
		},

		lookup: function(value, filterValue) {
			return _splitCallback(value, _lookup, filterValue);
		},

		updateSheets: _updateSheets,

		removeSheets: function(links) {
			if(ENABLE && links) {
				StyleSheets.remove(links);
			}
		},

		insertSheet: _insertSheet,

		/**
		 * Метод возвращает оригинальное имя класса по временному
		 *
		 * @public
		 * @param {string} value
		 * @param {string}
		 */
		reverse: function(value) {
			return _splitCallback(value, _reverse);
		},

		isWelter: function(name) {
			return Welter.isWelter(name);
		},

		/**
		 * Метод вставляет "визуальный шум" вокруг заданного элемента
		 *
		 * @param {Array} elements — искомые идентификаторы
		 * @param {HTMLElement} [context] где искать элементы
		 */
		wrap: function (elements, context) {
			if (ENABLE) {
				var context = context || document;
				var id

				// Присвоен ли этому элементу id
				if (context[__cid]) {
					id = context[__cid]
				} else {
					id = ++__uid
					context[__cid] = id
				}

				// Данные для этого элемента
				var data = __data[id]

				if (data == null) {
					data = {};
				}

				elements.forEach(function (originalSelector) {
					if (!data[originalSelector]) {
						var smokeSelector = _selectors(originalSelector);

						data[originalSelector] = smokeSelector;

						__data[id] = data

						Welter.wrap(context, smokeSelector);
					}
				});
			}
		},

		/**
		 * Метод возвращает css выражение calc считающее случайными операторами нужный результат
		 */
		calcString: function(result, unit) {
			return ENABLE ? Utils.calcString(result, unit) : result + unit;
		},

		/**
		 * Удалить кеш для элемента
		 * @param {HTMLElement} el
		 */
		removeCache: function (el) {
			// id элемента
			delete __data[el[__cid]]
			// данные для этого id
			delete el[__cid]
		},

		isEnabled: function () {
			return ENABLE;
		}
	};

	return Locator;
});
