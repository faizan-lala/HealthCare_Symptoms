const { validationResult } = require('express-validator');
const Symptom = require('../models/Symptom');

// @desc    Create new symptom log
// @route   POST /api/symptoms
// @access  Private
const createSymptom = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const symptomData = {
      ...req.body,
      user: req.user.id
    };

    const symptom = await Symptom.create(symptomData);
    await symptom.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Symptom logged successfully',
      data: { symptom }
    });
  } catch (error) {
    console.error('❌ Create symptom error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating symptom log',
      error: error.message
    });
  }
};

// @desc    Get all symptoms for user
// @route   GET /api/symptoms
// @access  Private
const getSymptoms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      severity,
      name,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Add filters
    if (status) query.status = status;
    if (severity) query.severity = { $gte: parseInt(severity) };
    if (name) query.name = { $regex: name, $options: 'i' };

    // Execute query with pagination
    const symptoms = await Symptom.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Symptom.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        symptoms,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('❌ Get symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symptoms',
      error: error.message
    });
  }
};

// @desc    Get single symptom
// @route   GET /api/symptoms/:id
// @access  Private
const getSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { symptom }
    });
  } catch (error) {
    console.error('❌ Get symptom error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symptom',
      error: error.message
    });
  }
};

// @desc    Update symptom
// @route   PUT /api/symptoms/:id
// @access  Private
const updateSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Symptom updated successfully',
      data: { symptom }
    });
  } catch (error) {
    console.error('❌ Update symptom error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating symptom',
      error: error.message
    });
  }
};

// @desc    Delete symptom
// @route   DELETE /api/symptoms/:id
// @access  Private
const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Symptom deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete symptom error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting symptom',
      error: error.message
    });
  }
};

// @desc    Get symptom statistics for user
// @route   GET /api/symptoms/stats
// @access  Private
const getSymptomStats = async (req, res) => {
  try {
    const { timeframe = '30' } = req.query;
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Basic stats
    const stats = await Symptom.getUserStats(req.user.id);

    // Recent symptoms
    const recentSymptoms = await Symptom.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Symptom frequency
    const symptomFrequency = await Symptom.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severity' },
          latestOccurrence: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Severity trends
    const severityTrends = await Symptom.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          avgSeverity: { $avg: '$severity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {},
        recentCount: recentSymptoms.length,
        symptomFrequency,
        severityTrends,
        timeframe: days
      }
    });
  } catch (error) {
    console.error('❌ Get symptom stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symptom statistics',
      error: error.message
    });
  }
};

// @desc    Get common symptoms for quick input
// @route   GET /api/symptoms/common
// @access  Private
const getCommonSymptoms = async (req, res) => {
  try {
    // Get most common symptoms for this user
    const userCommon = await Symptom.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Predefined common symptoms
    const predefined = [
      'Headache', 'Fever', 'Cough', 'Sore throat', 'Runny nose',
      'Nausea', 'Fatigue', 'Muscle aches', 'Chest pain', 'Shortness of breath',
      'Dizziness', 'Abdominal pain', 'Back pain', 'Joint pain', 'Insomnia'
    ];

    const commonSymptoms = userCommon.map(item => ({
      name: item._id,
      frequency: item.count,
      avgSeverity: Math.round(item.avgSeverity * 10) / 10,
      source: 'user'
    }));

    // Add predefined symptoms that user hasn't used
    predefined.forEach(symptom => {
      if (!commonSymptoms.some(cs => cs.name.toLowerCase() === symptom.toLowerCase())) {
        commonSymptoms.push({
          name: symptom,
          frequency: 0,
          avgSeverity: 0,
          source: 'predefined'
        });
      }
    });

    res.status(200).json({
      success: true,
      data: { commonSymptoms }
    });
  } catch (error) {
    console.error('❌ Get common symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching common symptoms',
      error: error.message
    });
  }
};

module.exports = {
  createSymptom,
  getSymptoms,
  getSymptom,
  updateSymptom,
  deleteSymptom,
  getSymptomStats,
  getCommonSymptoms
};
