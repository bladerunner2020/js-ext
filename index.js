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

if (!Array.prototype.forEach){
    Array.prototype.forEach = function(f) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);
        var len = O.length;

        for (var i = 0; i < len; i++)
            f(O[i]);
    };
}

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}

if (!Array.prototype.map) {
    Array.prototype.map = function(callback) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result.push(callback(this[i]))
        }
        return result;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        this.replace(/^\s+|\s+$/gm,'');
    }
}

if (!Date.now) {
    Date.now = function() {
        var current = new Date();
        return current.getTime();
    }
}

function mergeByProperty(arr1, arr2, prop) {
    arr2.forEach(function(arr2obj) {
        var arr1obj = arr1.find(function(arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });

        arr1obj ? Object.assign(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}

if (!JSON.parse) {
    JSON.parse = JSON.Parse;
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
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
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

var _old_slice = Array.prototype.slice;
Array.prototype.slice = function() {
    return arguments.length? _old_slice.apply(this, arguments) : _old_slice.apply(this, [0]);
};

function setTimeout(cb, timeout){
    return IR.SetTimeout(timeout, cb);
}

function clearTimeout(timer) {
    return IR.ClearTimeout(timer);
}

function setInterval(cb, interval) {
    return IR.SetInterval(interval, cb);
}

function clearInterval(timer) {
    return IR.ClearInterval(timer);
}

