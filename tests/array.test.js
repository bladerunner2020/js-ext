/* eslint-disable no-extend-native */
const original = {
  isArray: Array.isArray,

  indexOf: Array.prototype.indexOf,
  includes: Array.prototype.includes
};

Array.prototype.indexOf = undefined;
Array.prototype.includes = undefined;
Array.isArray = undefined;

require('../js-ext');

describe('array', () => {
  it('test array.prototype.indexOf', () => {
    expect(Array.prototype.indexOf).not.toBe(original.indexOf);
    expect([1, 2, 3, 4, 5].indexOf(3)).toBe(2);
    expect([1, 2, 3, 4, 5].indexOf(3, 2)).toBe(2);
    expect([1, 2, 3, 4, 5].indexOf(3, 3)).toBe(-1);
    expect([1, 1, 1, 1, 1].indexOf(1)).toBe(0);
    expect([1, 1, 1, 1, 1].indexOf(1, 4)).toBe(4);
    expect([1, 1, 1, 1, 1].indexOf(1, 5)).toBe(-1);
    expect([1, 2, 3, 4, 5].indexOf(42)).toBe(-1);
    expect(['1', '2', '3', '4', '5'].indexOf('1')).toBe(0);
    expect([].indexOf(undefined)).toBe(-1);
  });

  it('test array.prototype.includes', () => {
    expect(Array.prototype.includes).not.toBe(original.includes);
    expect([1, 2, 3, 4, 5].includes(3)).toBe(true);
    expect([1, 2, 3, 4, 5].includes(3, 2)).toBe(true);
    expect([1, 2, 3, 4, 5].includes(3, 3)).toBe(false);
    expect([1, 1, 1, 1, 1].includes(1)).toBe(true);
    expect([1, 1, 1, 1, 1].includes(1, 4)).toBe(true);
    expect([1, 1, 1, 1, 1].includes(1, 5)).toBe(false);
    expect([1, 2, 3, 4, 5].includes(42)).toBe(false);
    expect(['1', '2', '3', '4', '5'].includes('1')).toBe(true);
  });

  it('test array.isArray', () => {
    expect(Array.isArray).not.toBe(original.isArray);
    expect(Array.isArray([1, 2, 3, 4, 5])).toBe(true);
    expect(Array.isArray([])).toBe(true);
    expect(Array.isArray(null)).toBe(false);
    expect(Array.isArray(undefined)).toBe(false);
    expect(Array.isArray(42)).toBe(false);
    expect(Array.isArray('array')).toBe(false);
    expect(Array.isArray({ 1: 1 })).toBe(false);
  });
});
