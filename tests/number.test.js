IR = {};

const original = {
  isNaN: Number.isNaN,
  isInteger: Number.isInteger
};

Number.isNaN = undefined;
Number.isInteger = undefined;

require('../js-ext');

describe('Number test', () => {
  it('Number.isNaN', () => {    
    expect(Number.isNaN).toBeDefined();
    expect(Number.isNaN).not.toBe(original.isNaN);
  });

  it('Number.isInteger', () => {    
    expect(Number.isInteger).toBeDefined();
    expect(Number.isInteger).not.toBe(original.isInteger);
    expect(Number.isInteger(10)).toBe(true);
    expect(Number.isInteger(10 * 'z')).toBe(false);
    expect(Number.isInteger('z')).toBe(false);
    expect(Number.isInteger(1.0)).toBe(original.isInteger(1.0));
    expect(Number.isInteger(1.5)).toBe(original.isInteger(1.5 ));
    expect(Number.isInteger(undefined)).toBe(original.isInteger(undefined));
    expect(Number.isInteger(null)).toBe(original.isInteger(null));
  });
});
