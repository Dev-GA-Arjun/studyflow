const { asyncHandler } = require('../src/middleware/errors');

describe('StudyFlow JavaScript concept evidence', () => {
  // ============================================================
  // 1. PROMISES vs CALLBACKS
  // ============================================================
  test('compares callback-style failure handling with Promise rejection handling', async () => {
    function fetchWithCallbackStyle(callback) {
      setTimeout(() => {
        callback(new Error('callback failed'), null);
      }, 0);
    }

    // Callback-style error handling:
    // The callback receives the error explicitly as an argument.
    const callbackFailure = await new Promise((resolve) => {
      fetchWithCallbackStyle((error, result) => {
        resolve({ error, result });
      });
    });

    expect(callbackFailure.error).toBeInstanceOf(Error);
    expect(callbackFailure.error.message).toBe('callback failed');
    expect(callbackFailure.result).toBeNull();

    // Promise-style error handling:
    // The failure is represented as a rejected Promise.
    const promiseFailure = Promise.reject(
      new Error('promise failed')
    );

    // .catch() is used to handle the rejected Promise.
    const caughtError = await promiseFailure.catch((error) => {
      return error;
    });

    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError.message).toBe('promise failed');
  });

  // ============================================================
  // 2. PROMISE ERROR PROPAGATION + .catch(next)
  // ============================================================
  test('routes a rejected Promise-based controller through asyncHandler and .catch(next)', async () => {
    const events = [];

    const next = jest.fn((error) => {
      events.push(`next:${error.message}`);
    });

    const controller = () => {
      return Promise.reject(new Error('request failed'));
    };

    asyncHandler(controller)({}, {}, next);

    events.push('after handler call');

    // Allow the rejected Promise and .catch(next) to execute.
    await new Promise((resolve) => setImmediate(resolve));

    expect(events).toEqual([
      'after handler call',
      'next:request failed',
    ]);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'request failed',
      })
    );
  });

  // ============================================================
  // 3. HOISTING — FUNCTION DECLARATION
  // ============================================================
  test('demonstrates function declaration hoisting in JavaScript', () => {
    // The function is called before its declaration.
    // JavaScript makes function declarations available
    // during the creation phase of the scope.
    expect(createStudyMessage()).toBe('StudyFlow is ready.');

    function createStudyMessage() {
      return 'StudyFlow is ready.';
    }
  });

  // ============================================================
  // 4. HOISTING — var, let and const
  // ============================================================
  test('demonstrates hoisting behavior of var, let and const', () => {
    function demonstrateVar() {
      return varValue;

      var varValue = 10;
    }

    // var is hoisted and initialized with undefined.
    expect(demonstrateVar()).toBeUndefined();

    function demonstrateLet() {
      return letValue;

      let letValue = 10;
    }

    // let is hoisted into the scope but remains in the
    // Temporal Dead Zone until its declaration is executed.
    expect(() => demonstrateLet()).toThrow(ReferenceError);

    function demonstrateConst() {
      return constValue;

      const constValue = 20;
    }

    // const behaves similarly to let regarding the
    // Temporal Dead Zone.
    expect(() => demonstrateConst()).toThrow(ReferenceError);
  });

  // ============================================================
  // 5. EVENT LOOP — SYNCHRONOUS CODE vs MICROTASK vs TIMER
  // ============================================================
  test('runs Promise microtasks before timer callbacks after synchronous code', async () => {
    const events = [];

    // Timer callback is placed in the task/timer queue.
    setTimeout(() => {
      events.push('timer');
    }, 0);

    // Promise callback is placed in the microtask queue.
    Promise.resolve().then(() => {
      events.push('promise');
    });

    // This executes immediately while the current
    // synchronous code is still running.
    events.push('synchronous');

    // Wait long enough for both queued callbacks to execute.
    await new Promise((resolve) => setTimeout(resolve, 10));

    // JavaScript executes:
    // 1. synchronous code
    // 2. Promise microtasks
    // 3. timer/task callbacks
    expect(events).toEqual([
      'synchronous',
      'promise',
      'timer',
    ]);
  });
});
