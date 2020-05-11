IR = {};
const jsExtEscape = require('../js-ext').escape;

describe('escape', () => {
  it('test escape', () => {
    expect(jsExtEscape()).toBe(escape());
    expect(jsExtEscape(null)).toBe(escape(null));
    expect(jsExtEscape(12345)).toBe(escape(12345));
    expect(jsExtEscape('abc123')).toBe(escape('abc123'));
    expect(jsExtEscape('текст')).toBe(escape('текст'));
    expect(jsExtEscape('ÑÐ¸Ð¼Ð¾Ð²')).toBe(escape('ÑÐ¸Ð¼Ð¾Ð²'));
    expect(jsExtEscape({ a: 'a' })).toBe(escape({ a: 'a' }));
    expect(jsExtEscape('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./'))
      .toBe(escape('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./'));
  });
});
