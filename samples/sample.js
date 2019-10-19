/* eslint-disable no-console */
var testArray = [1, 2, 3, 4, 5];

// Expected output: [1, 2, 3, 4, 5]
// Without js-ext: undefined
console.log(testArray.slice());

// Expected output: 2
// Without js-ext: exception - function is not defined
console.log(testArray.indexOf(3));

// Expected output: true
// Without js-ext: exception - function is not defined
console.log(testArray.every(function (item) {
    return (item < 10);
}));

// Expected output: true
// Without js-ext: exception - function is not defined
console.log(Array.isArray(testArray));


// Expected output: 15
// Without js-ext: exception - function is not defined
var s = 0;
testArray.forEach(function (item) {
    s += item;
});
console.log(s);

IR = {};

const jsExtEscape = require('../js-ext');
console.log('done');




