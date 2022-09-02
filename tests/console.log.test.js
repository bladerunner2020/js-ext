IR = {};
const { JsExtLogger } = require('../js-ext');

describe('console.log', () => {
  it('jsExtLogger to be defined', () => {
    expect(JsExtLogger()).toBeDefined();
  });
  it('print string', () => {
    const mock = jest.fn();
    const log = new JsExtLogger(mock);
    log('Hello');
    expect(mock).toBeCalledWith('Hello ');
  });
  it('print number', () => {
    const mock = jest.fn();
    const log = new JsExtLogger(mock);
    log(42);
    expect(mock).toBeCalledWith('42 ');
  });
  it('print strings and number', () => {
    const mock = jest.fn();
    const log = new JsExtLogger(mock);
    log('Hello', 42);
    expect(mock).toBeCalledWith('Hello 42 ');
  });
  // it('print array', () => {
  //   const mock = jest.fn();
  //   const log = new JsExtLogger(mock);
  //   log(['Hello', 42]);
  //   expect(mock).toBeCalledWith('[ \nHello, 42\n ] ');
  // });
});
