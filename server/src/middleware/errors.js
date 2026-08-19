class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function asyncHandler(controller) {
  return (request, response, next) => {
    Promise.resolve(controller(request, response, next)).catch(next);
  };
}

function errorHandler(error, request, response, next) {
  console.error(error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  if (error.code === '23503' || error.code === '23505' || error.code === '22P02') {
    return response.status(400).json({ error: 'The request contains invalid data.' });
  }

  return response.status(500).json({ error: 'Internal server error' });
}

module.exports = { AppError, asyncHandler, errorHandler };
