const express = require('express');
const aiController = require('../controllers/aiController');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();

router.post('/study-plan', asyncHandler(aiController.generateStudyPlan));

module.exports = router;