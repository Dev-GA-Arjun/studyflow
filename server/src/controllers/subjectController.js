const subjectService = require('../services/subjectService');
const { AppError } = require('../middleware/errors');
const { parseId, requireText, optionalText, requireInteger } = require('../middleware/validation');

async function listSubjects(request, response) {
  const userId = request.query.user_id
    ? requireInteger(Number(request.query.user_id), 'user_id')
    : undefined;
  const subjects = await subjectService.findSubjects(userId);
  response.status(200).json({ subjects });
}

async function getSubject(request, response, next) {
  try {
    const subject = await subjectService.findSubjectById(parseId(request.params.id, 'Subject'));
    if (!subject) throw new AppError(404, 'Subject not found.');
    response.status(200).json({ subject });
  } catch (error) {
    next(error);
  }
}

async function createSubject(request, response) {
  const subject = await subjectService.createSubject({
    userId: requireInteger(request.body.user_id, 'user_id'),
    name: requireText(request.body.name, 'name', 150),
    description: optionalText(request.body.description, 'description', 2000),
  });
  response.status(201).json({ subject });
}

async function updateSubject(request, response) {
  const updates = {};
  if (request.body.name !== undefined) updates.name = requireText(request.body.name, 'name', 150);
  if (request.body.description !== undefined) updates.description = optionalText(request.body.description, 'description', 2000);
  if (Object.keys(updates).length === 0) throw new AppError(400, 'At least one field is required.');

  const subject = await subjectService.updateSubject(parseId(request.params.id, 'Subject'), updates);
  if (!subject) throw new AppError(404, 'Subject not found.');
  response.status(200).json({ subject });
}

async function deleteSubject(request, response) {
  const subject = await subjectService.deleteSubject(parseId(request.params.id, 'Subject'));
  if (!subject) throw new AppError(404, 'Subject not found.');
  response.status(200).json({ message: 'Subject deleted.' });
}

module.exports = { listSubjects, getSubject, createSubject, updateSubject, deleteSubject };
