const {
  parseId,
  requireText,
  optionalText,
  requireInteger,
} = require('../src/middleware/validation');

describe('request validation utilities', () => {
  test('parses a positive numeric id', () => {
    expect(parseId('42', 'Task')).toBe(42);
  });

  test.each(['0', '-1', 'abc', ''])('rejects invalid task id %p', (value) => {
    expect(() => parseId(value, 'Task')).toThrow('Task id must be a positive integer.');
  });

  test('trims required text and accepts the maximum length', () => {
    expect(requireText('  Read SQL  ', 'title', 9)).toBe('Read SQL');
  });

  test.each([undefined, null, '', '   '])('rejects missing required text %p', (value) => {
    expect(() => requireText(value, 'title', 20)).toThrow('title is required.');
  });

  test('handles optional text without turning absent values into errors', () => {
    expect(optionalText(undefined, 'description', 20)).toBeNull();
    expect(optionalText('  Practice joins  ', 'description', 20)).toBe('Practice joins');
  });

  test('rejects optional text above its limit', () => {
    expect(() => optionalText('too long', 'description', 4)).toThrow('description is invalid.');
  });

  test.each([0, -2, 1.5, '1'])('rejects invalid positive integer %p', (value) => {
    expect(() => requireInteger(value, 'subject_id')).toThrow('subject_id must be a positive integer.');
  });
});