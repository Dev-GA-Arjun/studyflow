const { AppError } = require('./errors');

function parseId(value, resourceName) {
  if (!/^\d+$/.test(value)) {
    throw new AppError(400, `${resourceName} id must be a positive integer.`);
  }

  const id = Number(value);
  if (id < 1) {
    throw new AppError(400, `${resourceName} id must be a positive integer.`);
  }

  return id;
}

function requireText(value, fieldName, maximumLength) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, `${fieldName} is required.`);
  }

  if (value.trim().length > maximumLength) {
    throw new AppError(400, `${fieldName} is too long.`);
  }

  return value.trim();
}

function optionalText(value, fieldName, maximumLength) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim().length > maximumLength) {
    throw new AppError(400, `${fieldName} is invalid.`);
  }

  return value.trim();
}

function requireInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 1) {
    throw new AppError(400, `${fieldName} must be a positive integer.`);
  }

  return value;
}

module.exports = { parseId, requireText, optionalText, requireInteger };
