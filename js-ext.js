// js-ext.js
/* global IR, _DEBUGGER, _Error */

if (typeof IR != 'undefined') {
    if (typeof module !== 'object') {
        var module = {};
    }
    module.exports = {};
    
    if (typeof require == 'undefined') {
        var require = function(name) {
            var res = module[name] ? module[name] : null;
            
            if (res &&  res.moduleInitializer) {
                res = res.moduleInitializer();
            }
            
            return res;
        };
    }
    

    // В iridium не корректно работает slice без аргументов
    var _old_slice = Array.prototype.slice;
    Array.prototype.slice = function () {
        return arguments.length ? _old_slice.apply(this, arguments) : _old_slice.apply(this, [0]);
    };

    // eslint-disable-next-line no-unused-vars
    var irAddListener = function() {
        if (typeof _DEBUGGER !== 'undefined') {
            if (typeof _DEBUGGER.addListenerCount === 'undefined') {
                _DEBUGGER.addListenerCount = 0;
            }
        }

        var result = undefined;

        try {
            result = IR.AddListener.apply(undefined, arguments);
            if (typeof _DEBUGGER != 'undefined') {
                _DEBUGGER.addListenerCount++;
            }
        } catch (e) {
            var counterStr = typeof _DEBUGGER != 'undefined' ? '(' + _DEBUGGER.addListenerCount + ')' : '';
            if (typeof _Error !== 'undefined') {
                _Error('CRITICAL ERROR - AddListener failed ' + counterStr + ': '  + e.message);
            } else {
                e.message = 'AddListener failed ' + counterStr + ': '  + e.message;
            }

            throw e;
        }


        return result;
    };

    // escape implementation
    var _jsExtEscape = function(source) {
        source = '' + source;   // convet ToString()
        return source
            .split('')
            .map(function(ch) {
                var code = ch.charCodeAt(0);
                if ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./'.indexOf(ch) !== -1) {
                    return ch;
                } else if (code > 256) {
                    return '%u' + ('0000' + code.toString(16).toUpperCase()).slice(-4);
                }
                return '%' + ('00' + code.toString(16).toUpperCase()).slice(-2);
            })
            .join('');
    };
    module.exports.escape = _jsExtEscape;   // for jest tests

    if (typeof escape === 'undefined') {
        var escape = _jsExtEscape;
    }
    // end of escape implementation

    // eslint-disable-next-line no-unused-vars
    var setTimeout = function(cb, timeout){
        var timer = 0;

        if (typeof _DEBUGGER != 'undefined') {
            if (!_DEBUGGER.setTimeoutCounter) {
                _DEBUGGER.setTimeoutCounter = 0;
            }
        }

        try {
            timer = IR.SetTimeout(timeout >= 0 ? timeout : 0, cb);
            if (typeof _DEBUGGER != 'undefined') {
                _DEBUGGER.setTimeoutCounter++;
            }
        } catch (e) {
            var str = cb.toString();
            var name = str.match(/function(.*)\(/);
            name = name ? name.pop() : 'unknown';
            name = name ? name.replace(' ', '') : 'unknown';
            if (name == '') {
                name = str.match(/\/\*(.*)\*\//);
                name = name ? name = name.pop() : null;
                name = name ? '/*' + name + '*/' : 'unknown';
            }

            var counterStr = typeof _DEBUGGER != 'undefined' ? '(' + _DEBUGGER.setTimeoutCounter + ')' : '';
            if (typeof _Error != 'undefined') {
                _Error('CRITICAL ERROR - setTimeout(' + name + ', ' + timeout + ') failed ' + counterStr + ': '  + e.message);
            } else {
                e.message = 'setTimeout(' + name + ', ' + timeout + ') failed ' + counterStr + ': '  + e.message;
            }

            throw e;
        }

        return timer;
    };

    // eslint-disable-next-line no-unused-vars
    var clearTimeout = function(timer) {
        return IR.ClearTimeout(timer);
    };

    // eslint-disable-next-line no-unused-vars
    var setInterval = function(cb, interval) {
        var timer = 0;

        if (typeof _DEBUGGER != 'undefined') {
            if (!_DEBUGGER.setIntervalCounter) {
                _DEBUGGER.setIntervalCounter = 0;
            }
        }

        try {
            timer = IR.SetInterval(interval >= 0 ? interval : 0, cb);
            if (typeof _DEBUGGER != 'undefined') {
                _DEBUGGER.setIntervalCounter++;
            }
        } catch (e) {
            var str = cb.toString();
            var name = str.match(/function(.*)\(/);
            name = name ? name.pop() : 'unknown';
            name = name ? name.replace(' ', '') : 'unknown';
            if (name == '') {
                name = str.match(/\/\*(.*)\*\//);
                name = name ? name = name.pop() : null;
                name = name ? '/*' + name + '*/' : 'unknown';
            }

            var counterStr = typeof _DEBUGGER != 'undefined' ? '(' + _DEBUGGER.setIntervalCounter + ')' : '';

            if (typeof _Error != 'undefined') {
                _Error('CRITICAL ERROR - setInterval(' + name + ', ' + interval + ') failed ' + counterStr + ': '  + e.message);

            } else {
                e.message = 'setInterval(' + name + ', ' + interval + ') failed ' + counterStr + ': '  + e.message;
            }

            throw e;
        }


        return timer;
    };

    // eslint-disable-next-line no-unused-vars
    var clearInterval = function(timer) {
        return IR.ClearInterval(timer);
    };


    // Если в коде встречается где-нибудь console.log
    if (!console) {
        var console = {};
        console.log = IR.Log;
    }
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
if (!Date.prototype.toISOString) {
    (function() {

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        Date.prototype.toISOString = function() {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };

    }());
}

// https://stackoverflow.com/questions/5802461/javascript-which-browsers-support-parsing-of-iso-8601-date-string-with-date-par
(function() {
    var d = Date,
        // eslint-disable-next-line no-useless-escape
        regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.?(\d{0,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/,
        // regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/,
        lOff, lHrs, lMin;

    if (d.parse('2011-11-29T15:52:30.5') !== 1322599950500 ||
        d.parse('2011-11-29T15:52:30.52') !== 1322599950520 ||
        d.parse('2011-11-29T15:52:18.867') !== 1322599938867 ||
        d.parse('2011-11-29T15:52:18.867Z') !== 1322581938867 ||
        d.parse('2011-11-29T15:52:18.867-03:30') !== 1322594538867 ||
        d.parse('2011-11-29') !== 1322524800000 ||
        d.parse('2011-11') !== 1320105600000 ||
        d.parse('2011') !== 1293840000000) {

        d.__parse = d.parse;

        lOff = -(new Date().getTimezoneOffset());
        lHrs = Math.floor(lOff / 60);
        lMin = lOff % 60;

        d.parse = function(v) {

            var m = regexIso8601.exec(v);

            if (m) {
                return Date.UTC(
                    m[1],
                    (m[2] || 1) - 1,
                    m[3] || 1,
                    m[4] - (m[8] ? m[9] ? m[9] + m[10] : 0 : lHrs) || 0,
                    m[5] - (m[8] ? m[9] ? m[9] + m[11] : 0 : lMin) || 0,
                    m[6] || 0,
                    ((m[7] || 0) + '00').substr(0, 3)
                );
            }

            return d.__parse.apply(this, arguments);

        };
    }

    d.__fromString = d.fromString;

    d.fromString = function(v) {

        if (!d.__fromString || regexIso8601.test(v)) {
            return new d(d.parse(v));
        }

        return d.__fromString.apply(this, arguments);
    };

})();

// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';
  
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
  
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }
  
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
  
                // ПРИМЕЧАНИЕ: Технически, здесь должен быть Object.defineProperty на
                //             следующий индекс, поскольку push может зависеть от
                //             свойств на Object.prototype и Array.prototype.
                //             Но этот метод новый и коллизии должны быть редкими,
                //             так что используем более совместимую альтернативу.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }
  
        return res;
    };
}


// Шаги алгоритма ECMA-262, 5-е издание, 15.4.4.14
// Ссылка (en): http://es5.github.io/#x15.4.4.14
// Ссылка (ru): http://es5.javascript.ru/x15.4.html#x15.4.4.14
if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;

        // 1. Положим O равным результату вызова ToObject с передачей ему
        //    значения this в качестве аргумента.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Положим lenValue равным результату вызова внутреннего метода Get
        //    объекта O с аргументом "length".
        // 3. Положим len равным ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. Если len равен 0, вернём -1.
        if (len === 0) {
            return -1;
        }

        // 5. Если был передан аргумент fromIndex, положим n равным
        //    ToInteger(fromIndex); иначе положим n равным 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. Если n >= len, вернём -1.
        if (n >= len) {
            return -1;
        }

        // 7. Если n >= 0, положим k равным n.
        // 8. Иначе, n<0, положим k равным len - abs(n).
        //    Если k меньше нуля 0, положим k равным 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Пока k < len, будем повторять
        while (k < len) {
            // a. Положим Pk равным ToString(k).
            //   Это неявное преобразование для левостороннего операнда в операторе in
            // b. Положим kPresent равным результату вызова внутреннего метода
            //    HasProperty объекта O с аргументом Pk.
            //   Этот шаг может быть объединён с шагом c
            // c. Если kPresent равен true, выполним
            //    i.  Положим elementK равным результату вызова внутреннего метода Get
            //        объекта O с аргументом ToString(k).
            //   ii.  Положим same равным результату применения
            //        Алгоритма строгого сравнения на равенство между
            //        searchElement и elementK.
            //  iii.  Если same равен true, вернём k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        'use strict';
        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the this
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method
        //    of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method
                //    of O with argument Pk.
                kValue = O[k];

                // ii. Let testResult be the result of calling the Call internal method
                //     of callbackfn with T as the this value and argument list
                //     containing kValue, k, and O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. If ToBoolean(testResult) is false, return false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}


if (!Array.prototype.forEach){
    Array.prototype.forEach = function(f) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);
        var len = O.length;

        for (var i = 0; i < len; i++)
            f(O[i], i);
    };
}

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}

// Шаги алгоритма ECMA-262, 5-е издание, 15.4.4.19
// Ссылка (en): http://es5.github.com/#x15.4.4.19
// Ссылка (ru): http://es5.javascript.ru/x15.4.html#x15.4.4.19
if (!Array.prototype.map) {

    Array.prototype.map = function(callback, thisArg) {
  
        var T, A, k;
  
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
  
        // 1. Положим O равным результату вызова ToObject с передачей ему
        //    значения |this| в качестве аргумента.
        var O = Object(this);
  
        // 2. Положим lenValue равным результату вызова внутреннего метода Get
        //    объекта O с аргументом "length".
        // 3. Положим len равным ToUint32(lenValue).
        var len = O.length >>> 0;
  
        // 4. Если вызов IsCallable(callback) равен false, выкидываем исключение TypeError.
        // Смотрите (en): http://es5.github.com/#x9.11
        // Смотрите (ru): http://es5.javascript.ru/x9.html#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
  
        // 5. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }
  
        // 6. Положим A равным новому массиву, как если бы он был создан выражением new Array(len),
        //    где Array является стандартным встроенным конструктором с этим именем,
        //    а len является значением len.
        A = new Array(len);
  
        // 7. Положим k равным 0
        k = 0;
  
        // 8. Пока k < len, будем повторять
        while (k < len) {
  
            var kValue, mappedValue;
  
            // a. Положим Pk равным ToString(k).
            //   Это неявное преобразование для левостороннего операнда в операторе in
            // b. Положим kPresent равным результату вызова внутреннего метода HasProperty
            //    объекта O с аргументом Pk.
            //   Этот шаг может быть объединён с шагом c
            // c. Если kPresent равен true, то
            if (k in O) {
  
                // i. Положим kValue равным результату вызова внутреннего метода Get
                //    объекта O с аргументом Pk.
                kValue = O[k];
  
                // ii. Положим mappedValue равным результату вызова внутреннего метода Call
                //     функции callback со значением T в качестве значения this и списком
                //     аргументов, содержащим kValue, k и O.
                mappedValue = callback.call(T, kValue, k, O);
  
                // iii. Вызовем внутренний метод DefineOwnProperty объекта A с аргументами
                // Pk, Описатель Свойства
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true }
                // и false.
  
                // В браузерах, поддерживающих Object.defineProperty, используем следующий код:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });
  
                // Для лучшей поддержки браузерами, используем следующий код:
                A[k] = mappedValue;
            }
            // d. Увеличим k на 1.
            k++;
        }
  
        // 9. Вернём A.
        return A;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (var i = 0; i < count; i++) {
            rpt += str;
        }
        return rpt;
    };
}

if (!Date.now) {
    Date.now = function() {
        var current = new Date();
        return current.getTime();
    };
}

// eslint-disable-next-line no-unused-vars
function mergeByProperty(arr1, arr2, prop) {
    arr2.forEach(function(arr2obj) {
        var arr1obj = arr1.find(function(arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });

        arr1obj ? Object.assign(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}

if (!JSON.parse) {
    JSON.parse = function (s) {
        function makeUpReplaceStr(str, symbol) {
            var replacement = '!' + symbol;

            while (str.indexOf(replacement) != -1) {
                replacement = '!' + replacement;
            }

            return replacement;
        }

        function replaceCRLF(obj, rCR, rLF) {
            if (!obj) {
                return obj;
            }
            for (var n in obj) {
                if (obj.hasOwnProperty(n)) {
                    var property = obj[n];

                    if (typeof property == 'string') {
                        var re1 = new RegExp(rCR, 'g');
                        var re2 = new RegExp(rLF, 'g');
                        obj[n] = property.replace(re1, '\r').replace(re2, '\n');
                    } else if (typeof property == 'object') {
                        replaceCRLF(property, rCR, rLF);
                    }
                }
            }
        }


        var rCR = makeUpReplaceStr(s, 'r');
        var rLF = makeUpReplaceStr(s, 'n');

        var newStr = s.replace(/\r/g, rCR);
        newStr = newStr.replace(/\n/g, rLF);

        var obj = JSON.Parse(newStr);
        replaceCRLF(obj, rCR, rLF);
        return obj;
    };
}

if (!JSON.stringify) {
    JSON.stringify = JSON.Stringify;
}

if (!Number.isInteger) {
    Number.isInteger = Number.isInteger || function (value) {
        return typeof value === 'number' &&
                isFinite(value) &&
                Math.floor(value) === value;
    };
}

// https://github.com/Raynos/function-bind


'use strict';

if (!Function.prototype.bind) {

    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = '[object Function]';

    Function.prototype.bind = function (that) {
        var target = this;
        if (typeof target !== 'function' || toStr.call(target) !== funcType) {
            throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);

        var bound;
        /**
         * @this
         */
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments, 0))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments, 0))
                );
            }
        };

        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

        if (target.prototype) {
            var Empty = function Empty() {
            };
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }

        return bound;
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

if (typeof Object.create !== 'function') {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error('This browser\'s implementation of Object.create is a shim and doesn\'t support \'null\' as the first argument.');
        }

        if (typeof propertiesObject != 'undefined') {
            throw new Error('This browser\'s implementation of Object.create is a shim and doesn\'t support a second argument.');
        }

        function F() {}
        F.prototype = proto;

        return new F();
    };
}
