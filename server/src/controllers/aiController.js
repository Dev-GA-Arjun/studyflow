const aiService = require('../services/aiService');
const { AppError } = require('../middleware/errors');
const { requireText } = require('../middleware/validation');

function requireNumber(value, fieldName, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new AppError(400, `${fieldName} must be between ${minimum} and ${maximum}.`);
  }
  return number;
}

async function generateStudyPlan(request, response) {
  const input = {
    subject: requireText(request.body.subject, 'subject', 150),
    topics: requireText(request.body.topics, 'topics', 2000),
    hoursPerDay: requireNumber(request.body.hoursPerDay, 'hoursPerDay', 0.5, 12),
    days: requireNumber(request.body.days, 'days', 1, 30),
  };

  if (!Number.isInteger(input.days)) {
    throw new AppError(400, 'days must be a whole number.');
  }

  const plan = await aiService.generateStudyPlan(input);
  response.status(200).json({ plan });
}

module.exports = { generateStudyPlan };