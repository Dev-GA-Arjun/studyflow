const taskService = require('../services/taskService');
const { AppError } = require('../middleware/errors');
const { parseId, requireText, optionalText, requireInteger } = require('../middleware/validation');

function validateStatus(status) {
  const allowedStatuses = ['pending', 'in_progress', 'completed'];
  if (!allowedStatuses.includes(status)) throw new AppError(400, 'status is invalid.');
  return status;
}

function validateDueDate(dueDate) {
  if (dueDate === undefined || dueDate === null || dueDate === '') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw new AppError(400, 'due_date must use YYYY-MM-DD format.');
  return dueDate;
}

async function listTasks(request, response) {
  const status = request.query.status ? validateStatus(request.query.status) : undefined;
  const tasks = await taskService.findTasks(status);
  response.status(200).json({ tasks });
}

async function getTask(request, response) {
  const task = await taskService.findTaskById(parseId(request.params.id, 'Task'));
  if (!task) throw new AppError(404, 'Task not found.');
  response.status(200).json({ task });
}

async function createTask(request, response) {
  const task = await taskService.createTask({
    subjectId: requireInteger(request.body.subject_id, 'subject_id'),
    title: requireText(request.body.title, 'title', 200),
    description: optionalText(request.body.description, 'description', 2000),
    dueDate: validateDueDate(request.body.due_date),
    status: request.body.status === undefined ? 'pending' : validateStatus(request.body.status),
  });
  response.status(201).json({ task });
}

async function updateTask(request, response) {
  const updates = {};
  if (request.body.title !== undefined) updates.title = requireText(request.body.title, 'title', 200);
  if (request.body.description !== undefined) updates.description = optionalText(request.body.description, 'description', 2000);
  if (request.body.due_date !== undefined) updates.dueDate = validateDueDate(request.body.due_date);
  if (request.body.status !== undefined) updates.status = validateStatus(request.body.status);
  if (Object.keys(updates).length === 0) throw new AppError(400, 'At least one field is required.');

  const task = await taskService.updateTask(parseId(request.params.id, 'Task'), updates);
  if (!task) throw new AppError(404, 'Task not found.');
  response.status(200).json({ task });
}

async function deleteTask(request, response) {
  const task = await taskService.deleteTask(parseId(request.params.id, 'Task'));
  if (!task) throw new AppError(404, 'Task not found.');
  response.status(200).json({ message: 'Task deleted.' });
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
