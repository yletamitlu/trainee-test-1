define('smokescreen/Cid', function() {
	/*
	 * Copy-past from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	 */
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	var counter = 1000;

	var postfixChars = (function(chars) {
		for(var i = 0; i< 10; i++) {
			chars.push(i.toString());
		}

		for(var i=0; i < 25; i++) {
			chars.push(String.fromCharCode(97 + i));
			chars.push(String.fromCharCode(65 + i));
		}

		return shuffle(chars);
	})([]);

	var idOf_MAX = postfixChars.length;

	function idOf(i) {
		return (i >= idOf_MAX ? idOf((i / idOf_MAX >> 0) - 1) : '') + postfixChars[i % idOf_MAX >> 0];
	}

	var prefix = (function() {
		var result = [];

		for(var i = 0; result.length < 5 && i < postfixChars.length; i++) {
			if(result.length > 0 || !/[0-9]/.test(postfixChars[i])) {
				result.push(postfixChars[i]);
			}
		}

		return result.join('');
	})();

	return function() {
		return prefix + idOf(counter++);
	}
});
