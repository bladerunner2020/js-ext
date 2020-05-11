IR = {};
const objectAssign = require('../js-ext').__ObjectAssign;

describe('Object method tests', () => {
  it('Object.assign', () => {
    const obj1 = { prop1: 'prop1' };
    const obj2 = { prop2: 'prop2' };
    const obj3 = { prop1: 'new prop1', prop3: 'prop3', obj: { prop4: 4 } };
    expect(objectAssign(obj1)).toEqual(Object.assign(obj1));
    expect(objectAssign(obj1, null, undefined, obj2)).toEqual(Object.assign(obj1, null, undefined, obj2));
    expect(objectAssign(obj1, obj2, obj3)).toEqual(Object.assign(obj1, obj2, obj3));
    expect(() => objectAssign()).toThrow();
  });
});
