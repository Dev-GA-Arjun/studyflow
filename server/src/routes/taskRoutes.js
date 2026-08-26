const express = require('express');
const taskController = require('../controllers/taskController');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();

router.get('/', asyncHandler(taskController.listTasks));
router.get('/summary', asyncHandler(taskController.summarizeTasks));
router.post('/', asyncHandler(taskController.createTask));
router.get('/:id', asyncHandler(taskController.getTask));
router.patch('/:id', asyncHandler(taskController.updateTask));
router.delete('/:id', asyncHandler(taskController.deleteTask));

module.exports = router;
