class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

function asyncHandler(controller) {
  return (request, response, next) => {
    Promise.resolve()
      .then(() => controller(request, response, next))
      .catch(next);
  };
}

function errorHandler(error, request, response, next) {
  console.error(error);

  if (response.headersSent) return next(error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' });
  }

  if (error.code === '23505') {
    return response.status(400).json({ error: 'A record with those values already exists.' });
  }

  if (error.code === '23503') {
    return response.status(400).json({ error: 'A referenced resource does not exist.' });
  }

  if (error.code === '22P02') {
    return response.status(400).json({ error: 'The request contains invalid data.' });
  }

  return response.status(500).json({ error: 'Internal server error' });
}

module.exports = { AppError, asyncHandler, errorHandler };
