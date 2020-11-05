define('smokescreen/Utils', function() {
	var urlConstructorExists = false;

	try {
		urlConstructorExists = (new URL('http://example.com/')).href === 'http://example.com/';
	} catch (exception) {}

	/**
	* Метод возвращает случайное число из заданного диапазона
	*
	* @param {number} min — Минимальное значение
	* @param {number} max — Максимальное значение
	* @return {number}
	*/
	function _random(min, max) {
		return (Math.random() * (max - min + 1) + min) | 0;
	}

	var supportCssCalc;
	function isSupportedCSSCalc() {
		if(supportCssCalc === undefined) {
			try {
				if(typeof window.getComputedStyle === 'function') {
					var elem = document.createElement('div');
					elem.style.height = 'calc(30px + 30px)';
					document.getElementsByTagName('body')[0].appendChild(elem);

					supportCssCalc = window.getComputedStyle(elem, null).getPropertyValue('height') === '60px';

					elem.parentNode.removeChild(elem);
				}

			} catch(e) {
				supportCssCalc = false;
			}
		}

		return supportCssCalc;
	}

	var toArray = function (arrayLike) {
		return Array.prototype.slice.call(arrayLike)
	}

	var extend = function () {
		var args = toArray(arguments);
		var target = args.shift();

		args.forEach(function (source) {
			for (var prop in source) {
				target[prop] = source[prop];
			}
		})

		return target
	}

	var merge = function () {
		var args = toArray(arguments);
		var target = args.shift();

		args.forEach(function (source) {
			for (var prop in source) {
				if (!target[prop]) {
					target[prop] = source[prop];
				}
			}
		})

		return target
	}

	return {
		random: _random,

		calcString: function(result, unit) {
			result = parseInt(result, 10);

			if(isSupportedCSSCalc()) {
				var res = [];
				var sum = 0;

				for(var i=0, l = _random(1,6); i < l; i++) {
					res.push(_random(-100, 100));
					sum += res[res.length -1];
				}

				if(sum !== result) {
					res.push(result - sum);
				}

				return 'calc(' + res.map(function(p) {
					return p.toString() + unit;

				}).join(' + ') + ')';

			} else {
				return result + unit;
			}
		},

		replaceUrl: function(chunk, baseUrl, closingParenthesis) {
			if(urlConstructorExists && baseUrl) {
				var firstChar = chunk.charAt(0);
				var quoted = (firstChar === '"') || (firstChar === '\'');

				var from = 0 + quoted;
				var to;

				if(closingParenthesis) {
					to = chunk.indexOf((quoted ? firstChar : '') + ')');
				} else {
					to = quoted ? chunk.indexOf(firstChar,from+1) : chunk.length;
				}

				var url = chunk.slice(from, to);

				try {
					url = (new URL(url, baseUrl)).href;
				} catch (exception) {}

				return chunk.slice(0, from) + url + chunk.slice(to);

			} else {
				return chunk;
			}
		},

		replaceContent: function (chunk) {
			var firstChar = chunk.charAt(0);
			var isQuoted = (firstChar === '"') || (firstChar === '\'');

			// Если значение в кавычках, то берём от кавычки до соответствующей кавычки,
			// иначе до ближайшей `;`
			var from = Number(isQuoted)
			var to = isQuoted ? chunk.indexOf(firstChar, from) : chunk.indexOf(';', from);

			var letters = chunk.slice(from, to);

			var content = '';

			// заменяем только текст в кавычках, если там нет уже заэнкоженных символов
			if (/^\\[a-z0-9]+$/.test(letters) || !isQuoted) {
				content = letters;

			} else {
				for (var i = 0; i < letters.length; i++) {
					var code = letters[i].charCodeAt(0);

					if (isNaN(code)) {
						continue;
					}

					content += '\\' + code.toString(16);
				}
			}

			return chunk.slice(0, from) + content + chunk.slice(to);
		},

		iterate: function(object, callback, context) {
			for (var field in object) {
				if (Object.prototype.hasOwnProperty.call(object, field) && field !== 'length') {
					callback.call(context || this, object[field], field);
				}
			}
		},

		extend: extend,
		merge: merge,
		toArray:  toArray
	};
});
