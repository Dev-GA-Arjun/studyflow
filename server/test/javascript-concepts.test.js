const { asyncHandler } = require('../src/middleware/errors');

describe('StudyFlow JavaScript asynchronous behavior', () => {
  test('passes a rejected controller Promise to Express next after the current stack', async () => {
    const events = [];
    const next = jest.fn(() => events.push('next callback'));
    const controller = () => Promise.reject(new Error('request failed'));

    asyncHandler(controller)({}, {}, next);
    events.push('after handler call');

    await new Promise((resolve) => setImmediate(resolve));

    expect(events).toEqual(['after handler call', 'next callback']);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('calls a function declaration before its declaration', () => {
    // Function declarations are hoisted, so this call works before the declaration below.
    expect(createStudyMessage()).toBe('StudyFlow is ready.');

    function createStudyMessage() {
      return 'StudyFlow is ready.';
    }
  });
});