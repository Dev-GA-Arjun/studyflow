const {
  AppError,
  asyncHandler,
  errorHandler,
} = require('../src/middleware/errors');

function createResponse() {
  return {
    headersSent: false,
    json: jest.fn(),
    status: jest.fn(function setStatus(statusCode) {
      this.statusCode = statusCode;
      return this;
    }),
  };
}

describe('server error handling', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test('AppError preserves the intended status and message', () => {
    const error = new AppError(404, 'Task not found.');

    expect(error).toMatchObject({ name: 'AppError', statusCode: 404, message: 'Task not found.' });
  });

  test('asyncHandler forwards synchronous controller throws', async () => {
    const next = jest.fn();

    asyncHandler(() => {
      throw new Error('controller failed');
    })({}, {}, next);
    await Promise.resolve();
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'controller failed' }));
  });

  test.each([
    [new AppError(400, 'title is required.'), 400, 'title is required.'],
    [new AppError(404, 'Task not found.'), 404, 'Task not found.'],
    [{ code: '23503', detail: 'database internals must not escape' }, 400, 'A referenced resource does not exist.'],
    [{ code: '23505', detail: 'database internals must not escape' }, 400, 'A record with those values already exists.'],
    [{ type: 'entity.parse.failed' }, 400, 'Request body must contain valid JSON.'],
    [new Error('secret database connection details'), 500, 'Internal server error'],
  ])('returns a safe JSON error for %p', (error, expectedStatus, expectedMessage) => {
    const response = createResponse();

    errorHandler(error, {}, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(expectedStatus);
    expect(response.json).toHaveBeenCalledWith({ error: expectedMessage });
    expect(JSON.stringify(response.json.mock.calls[0][0])).not.toContain('database internals');
  });
});