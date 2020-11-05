define('smokescreen/Welter', [
	'smokescreen/Cid',
	'smokescreen/Utils'
], function (cid, Utils) {
	'use strict';

	var _counter = 0;

	var _keys = {};

	function _id() {
		var key = cid(true);
		_keys[key] = true;
		return key;
	}

	/**
	 * Данный модуль позволяет генерировать визульный шум из DOM-элементов
	 */

	/**
	 * Метод генерирует DOM-фрагменты
	 *
	 * @param {number} size — Максимальное количество элементов.
	 * @param {number} depth — глубина дочерних элементов
	 * @return {DocumentFragment}
	 */
	function _fragments(size, depth) {
		var fragment = document.createDocumentFragment();

		for (var index = 0, max = Utils.random(0, size); index < max; index++) {
			var child = document.createElement('div');

			_counter++;

			if(Utils.random(0, depth)) {
				child.appendChild(_fragments(size, depth - 1));
			}

			// Поскольку лайаут строится на идентификаторах,
			// нам нужно создать не только "шумовые" элементы,
			// но и задать им рандомные имена

			var useAttr = 0;

			if(!(Utils.random(0, size) % 2)) {
				child.id = _id();
				useAttr++;
			}

			if(!(Utils.random(0, size) % 5)) {
				child.setAttribute('data-bem', _id());
				useAttr++;
			}

			if(!(Utils.random(0, size) % 6)) {
				child.setAttribute('data-mnemo', _id());
				useAttr++;
			}

			if(!(Utils.random(0, size) % 3) || !useAttr) {
				child.className = _id();
			}

			fragment.appendChild(child);
		}

		return fragment;
	}

	return {
		isWelter: function(id) {
			return _keys[id] !== undefined;
		},

		/**
		 * Метод вставляет DOM-фрагменты в вокруг заданного элемента
		 *
		 * @param {HTMLElement|HTMLElement[]|jQuery} context
		 * @param {string} selector
		*/
		wrap: function (context, selector) {
			function _wrap(container) {
				container && Utils.toArray(container.querySelectorAll(selector)).forEach(function (node) {
					var fragments = _fragments(5, 5);
					var divs = fragments.querySelectorAll('div');
					var target = divs[Utils.random(0, divs.length - 1)];

					if (node && target) {
						node.originalParentNode = node.parentNode; // сохраним ссылку, чтобы в будущем проще было найти
						node.parentNode.insertBefore(fragments, node);
						target.appendChild(node);
					}
				});
			}

			try {
				if (context.nodeType) {
					_wrap(context);
				} else if (context.length >= 0) {
					// Array-like
					if (context.length === 1) {
						_wrap(context[0]);
					} else {
						Utils.toArray(context).forEach(_wrap);
					}
				} else {
					console.warn('[Walter.wrap] this "context" not supported:', context);
				}
			} catch (error) {
				console.error(error);
			}
		}
	};
});
