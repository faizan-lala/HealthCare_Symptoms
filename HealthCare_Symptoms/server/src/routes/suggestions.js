const express = require('express');
const { body } = require('express-validator');
const {
  analyzeSymptomsAndSuggest,
  getSuggestionForSymptom,
  getHealthRecommendations,
  getRulesInfo
} = require('../controllers/suggestionController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Validation rules
const analyzeValidation = [
  body('symptomIds')
    .optional()
    .isArray()
    .withMessage('Symptom IDs must be an array'),
  body('symptomIds.*')
    .optional()
    .isMongoId()
    .withMessage('Each symptom ID must be a valid MongoDB ObjectId'),
  body('includeAll')
    .optional()
    .isBoolean()
    .withMessage('includeAll must be a boolean value')
];

// Routes
router.post('/analyze', analyzeValidation, analyzeSymptomsAndSuggest);
router.get('/symptom/:id', getSuggestionForSymptom);
router.get('/recommendations', getHealthRecommendations);
router.get('/rules', getRulesInfo);

module.exports = router;
