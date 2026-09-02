const { asyncHandler } = require('../src/middleware/errors');

describe('StudyFlow JavaScript concept evidence', () => {
  test('routes a rejected Promise-based controller through asyncHandler and .catch(next)', async () => {
    const events = [];
    const next = jest.fn((error) => events.push(`next:${error.message}`));
    const controller = () => Promise.reject(new Error('request failed'));

    asyncHandler(controller)({}, {}, next);
    events.push('after handler call');

    await new Promise((resolve) => setImmediate(resolve));

    expect(events).toEqual(['after handler call', 'next:request failed']);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'request failed' }));
  });

  test('demonstrates function declaration hoisting in JavaScript', () => {
    expect(createStudyMessage()).toBe('StudyFlow is ready.');

    function createStudyMessage() {
      return 'StudyFlow is ready.';
    }
  });

  test('runs Promise microtasks before timer callbacks after synchronous code', async () => {
    const events = [];

    setTimeout(() => {
      events.push('timer');
    }, 0);

    Promise.resolve().then(() => {
      events.push('promise');
    });

    events.push('synchronous');

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(events).toEqual([
      'synchronous',
      'promise',
      'timer',
    ]);
  });

  test('compares callback-style failure handling with Promise rejection handling', async () => {
    function fetchWithCallbackStyle(callback) {
      setTimeout(() => {
        callback(new Error('callback failed'), null);
      }, 0);
    }

    const callbackFailure = await new Promise((resolve) => {
      fetchWithCallbackStyle((error, result) => {
        resolve({ error, result });
      });
    });

    const promiseFailure = Promise.reject(new Error('promise failed'));

    await expect(promiseFailure).rejects.toThrow('promise failed');
    expect(callbackFailure.error).toBeInstanceOf(Error);
    expect(callbackFailure.error.message).toBe('callback failed');
    expect(callbackFailure.result).toBeNull();
  });
});
