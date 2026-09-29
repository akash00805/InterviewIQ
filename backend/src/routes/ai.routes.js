const express = require('express');
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');

const router = express.Router();

router.post('/generate-questions', protect, aiController.generateQuestions);
router.post('/evaluate-answer', protect, aiController.evaluateAnswer);

module.exports = router;
