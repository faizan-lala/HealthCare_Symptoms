const express = require('express');
const { body } = require('express-validator');
const {
  createSymptom,
  getSymptoms,
  getSymptom,
  updateSymptom,
  deleteSymptom,
  getSymptomStats,
  getCommonSymptoms
} = require('../controllers/symptomController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Validation rules
const symptomValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Symptom name must be between 1 and 100 characters'),
  body('severity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Severity must be a number between 1 and 10'),
  body('duration.value')
    .isNumeric({ no_symbols: false })
    .isFloat({ min: 0 })
    .withMessage('Duration value must be a positive number'),
  body('duration.unit')
    .isIn(['minutes', 'hours', 'days', 'weeks', 'months'])
    .withMessage('Duration unit must be one of: minutes, hours, days, weeks, months'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('temperature')
    .optional()
    .isFloat({ min: 95, max: 115 })
    .withMessage('Temperature must be between 95°F and 115°F'),
  body('bloodPressure.systolic')
    .optional()
    .isInt({ min: 50, max: 300 })
    .withMessage('Systolic pressure must be between 50 and 300'),
  body('bloodPressure.diastolic')
    .optional()
    .isInt({ min: 30, max: 200 })
    .withMessage('Diastolic pressure must be between 30 and 200'),
  body('status')
    .optional()
    .isIn(['active', 'improving', 'resolved', 'worsening'])
    .withMessage('Status must be one of: active, improving, resolved, worsening')
];

// Routes
router.get('/stats', getSymptomStats);
router.get('/common', getCommonSymptoms);
router.get('/', getSymptoms);
router.post('/', symptomValidation, createSymptom);
router.get('/:id', getSymptom);
router.put('/:id', updateSymptom);
router.delete('/:id', deleteSymptom);

module.exports = router;
