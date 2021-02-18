/**
 * @function
 * Генерирует массив элементов таблицы юникода в диапазоне кодов от firstChar до lastChar
 * @return {Array} resultArray
 * @param {string} firstChar - первый символ массива
 * @param {string} lastChar - последниц символ массива
 */
const getCharArray = (firstChar: string, lastChar: string) => {
    const resultArray = [];
    let i = firstChar.charCodeAt(0);
    const top = lastChar.charCodeAt(0);

    for (; i <= top; ++i) {
        resultArray.push(String.fromCharCode(i));
    }
    return resultArray;
}

const alphabetRUu = getCharArray('А', 'Я');

const alphabetENu = getCharArray('A', 'Z');

const alphabetRUl = getCharArray('а', 'я');

const alphabetENl = getCharArray('a', 'z');

const symbolsArr = getCharArray('!', '9');

const enUpper = {
    'A': '1040', 'B': '1042', 'C': '1057',
    'D': '5024', 'E': '1045', 'F': '988',
    'G': '5056', 'H': '1053', 'I': '1216',
    'J': '5035', 'K': '1050', 'L': '5086',
    'M': '1052', 'N': '0925', 'O': '1054',
    'P': '1056', 'Q': '\u051A', 'R': '5025',
    'S': '5082', 'T': '1058', 'U': '',
    'V': '5081', 'W': '5043', 'X': '1061',
    'Y': '1198', 'Z': '0918'
};

const enLower = {
    'a': '1072', 'b': 'b', 'c': '1089',
    'd': '\u0501', 'e': '1077', 'f': 'f',
    'g': '\u0261', 'h': 'h', 'i': '1110',
    'j': '1112', 'k': 'k', 'l': '\u217C',
    'm': 'm', 'n': '\uFF4E', 'o': '1086',
    'p': '1088', 'q': '\uFF51', 'r': 'r',
    's': '\u0455', 't': 't', 'u': '\u222A',
    'v': '\u1D20', 'w': '1121', 'x': '1093',
    'y': '1091', 'z': '\u1D22'
}

const ruUpper = {
    'А': '65', 'Б': '386', 'В': '66',
    'Г': '915', 'Д': '', 'Е': '69',
    'Ё': '', 'Ж': '', 'З': '',
    'И': '', 'Й': '', 'К': '75',
    'Л': '', 'М': '77', 'Н': '72',
    'О': '79', 'П': '0928', 'Р': '80',
    'С': '67', 'Т': '84', 'У': '',
    'Ф': '0934', 'Х': '88', 'Ц': '',
    'Ч': '', 'Ш': '', 'Щ': '',
    'Ъ': '', 'Ы': '', 'Ь': '',
    'Э': '', 'Ю': '', 'Я': '',
};

const ruLower = {
    'а': '97', 'б': 'б', 'в': 'в',
    'г': '\u1d26', 'д': 'д', 'е': '101',
    'ё': 'ё', 'ж': 'ж', 'з': 'з',
    'и': 'и', 'й': 'й', 'к': '\u03ba',
    'л': 'л', 'м': '\u1D0D', 'н': '\u029C',
    'о': '111', 'п': 'п', 'р': '112',
    'с': '99', 'т': 'т', 'У': '121',
    'ф': 'ф', 'х': '120', 'ц': 'ц',
    'ч': 'ч', 'ш': 'ш', 'щ': 'щ',
    'ъ': 'ъ', 'ы': 'ы', 'ь': 'ь',
    'э': 'э', 'ю': 'ю', 'я': 'я',
}

const symbols = {
    '.': '\u2024',
    '+': '\u16ED',
    '-': '\u2212',
    ',': '\u201A',
    '!': '\u01C3',
    '1': '\uFF11',
    '2': '\uFF12',
    '3': '\u2CCD',
    '4': '\uFF14',
    '5': '\uFF15',
    '6': '\uFF16',
    '7': '\uFF17',
    '8': '\uFF18',
    '9': '\uFF19',
}

/**
 * @function
 * Подменяет символ на другой символ Юникода визуально похожий на него
 * @return {string} resultChar - полученный символ
 * @param {string} char - символ, который нужно заменить
 */
const replaceChar = (char: string) => {
    let resultChar;
    if (alphabetRUu.indexOf(char) >= 0) {
        resultChar = ruUpper[char] ? String.fromCharCode(ruUpper[char]) : char;
    } else if (alphabetRUl.indexOf(char) >= 0) {
        if (ruLower[char]) {
            resultChar = +ruLower[char] ? String.fromCharCode(ruLower[char]) : ruLower[char];
        }
    } else if (alphabetENu.indexOf(char) >= 0) {
        resultChar = enUpper[char] ? String.fromCharCode(enUpper[char]) : char;
    } else if (alphabetENl.indexOf(char) >= 0) {
        if (enLower[char]) {
            resultChar = +enLower[char] ? String.fromCharCode(enLower[char]) : enLower[char];
        }
    } else if (symbolsArr.indexOf(char) >= 0) {
        resultChar = symbols[char] ? symbols[char] : char;
    } else {
        resultChar = char;
    }

    return resultChar;
}

/**
 * @function
 * Заменяет символы пришедшей строки на символы Юникода похожие визуально
 * @return  {string} - полученная строка
 * @param {string} str - входная строка
 */
const getBewilderedStr = (str: string): string => {
    return str.split('').map(replaceChar).join('');
};

export default getBewilderedStr;
