const express = require('express');
const subjectController = require('../controllers/subjectController');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();

router.get('/', asyncHandler(subjectController.listSubjects));
router.post('/', asyncHandler(subjectController.createSubject));
router.get('/:id', asyncHandler(subjectController.getSubject));
router.patch('/:id', asyncHandler(subjectController.updateSubject));
router.delete('/:id', asyncHandler(subjectController.deleteSubject));

module.exports = router;
