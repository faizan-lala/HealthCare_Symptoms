const Symptom = require('../models/Symptom');
const rulesEngine = require('../utils/rulesEngine');

// @desc    Get suggestions based on user's symptoms
// @route   POST /api/suggestions/analyze
// @access  Private
const analyzeSymptomsAndSuggest = async (req, res) => {
  try {
    const { symptomIds, includeAll = false } = req.body;

    let symptomsToAnalyze = [];

    if (symptomIds && symptomIds.length > 0) {
      // Analyze specific symptoms
      symptomsToAnalyze = await Symptom.find({
        _id: { $in: symptomIds },
        user: req.user.id
      });
    } else if (includeAll) {
      // Analyze all active symptoms from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      symptomsToAnalyze = await Symptom.find({
        user: req.user.id,
        status: { $in: ['active', 'worsening'] },
        createdAt: { $gte: sevenDaysAgo }
      }).sort({ createdAt: -1 });
    } else {
      // Analyze most recent symptoms (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      symptomsToAnalyze = await Symptom.find({
        user: req.user.id,
        createdAt: { $gte: oneDayAgo }
      }).sort({ createdAt: -1 }).limit(5);
    }

    if (symptomsToAnalyze.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No symptoms found for analysis',
        data: {
          suggestions: [],
          confidence: 0,
          reasoning: 'No recent symptoms available for analysis. Please log your symptoms first.'
        }
      });
    }

    // Run analysis through rules engine
    const analysis = rulesEngine.analyzeSymptoms(symptomsToAnalyze);

    // Add metadata
    const result = {
      ...analysis,
      analyzedSymptoms: symptomsToAnalyze.map(symptom => ({
        id: symptom._id,
        name: symptom.name,
        severity: symptom.severity,
        duration: symptom.duration,
        createdAt: symptom.createdAt
      })),
      analysisDate: new Date(),
      disclaimer: 'This analysis is for informational purposes only and does not replace professional medical advice. Please consult with a healthcare provider for proper medical evaluation.'
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Analyze symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing symptoms',
      error: error.message
    });
  }
};

// @desc    Get suggestions for a single symptom
// @route   GET /api/suggestions/symptom/:id
// @access  Private
const getSuggestionForSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: 'Symptom not found'
      });
    }

    // Analyze single symptom
    const analysis = rulesEngine.analyzeSymptoms([symptom]);

    const result = {
      ...analysis,
      symptom: {
        id: symptom._id,
        name: symptom.name,
        severity: symptom.severity,
        duration: symptom.duration,
        createdAt: symptom.createdAt
      },
      analysisDate: new Date(),
      disclaimer: 'This analysis is for informational purposes only and does not replace professional medical advice. Please consult with a healthcare provider for proper medical evaluation.'
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Get symptom suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting suggestion for symptom',
      error: error.message
    });
  }
};

// @desc    Get general health recommendations
// @route   GET /api/suggestions/recommendations
// @access  Private
const getHealthRecommendations = async (req, res) => {
  try {
    const { timeframe = 30 } = req.query;
    const days = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user's recent symptoms
    const recentSymptoms = await Symptom.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Generate pattern-based recommendations
    const recommendations = generateHealthRecommendations(recentSymptoms);

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        timeframe: days,
        basedon: `${recentSymptoms.length} symptoms in the last ${days} days`,
        disclaimer: 'These recommendations are general health advice and do not replace professional medical consultation.'
      }
    });
  } catch (error) {
    console.error('❌ Get health recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating health recommendations',
      error: error.message
    });
  }
};

// @desc    Get rules engine information
// @route   GET /api/suggestions/rules
// @access  Private (Admin only in production)
const getRulesInfo = async (req, res) => {
  try {
    const rules = rulesEngine.getAllRules();
    
    res.status(200).json({
      success: true,
      data: {
        totalRules: rules.length,
        ruleCategories: [
          { urgency: 'emergency', count: rules.filter(r => r.suggestions.urgency === 'emergency').length },
          { urgency: 'urgent', count: rules.filter(r => r.suggestions.urgency === 'urgent').length },
          { urgency: 'moderate', count: rules.filter(r => r.suggestions.urgency === 'moderate').length },
          { urgency: 'mild', count: rules.filter(r => r.suggestions.urgency === 'mild').length },
          { urgency: 'routine', count: rules.filter(r => r.suggestions.urgency === 'routine').length }
        ],
        rules: rules.map(rule => ({
          id: rule.id,
          name: rule.name,
          urgency: rule.suggestions.urgency,
          confidence: rule.suggestions.confidence
        }))
      }
    });
  } catch (error) {
    console.error('❌ Get rules info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rules information',
      error: error.message
    });
  }
};

// Helper function to generate health recommendations
function generateHealthRecommendations(symptoms) {
  const recommendations = [];

  if (symptoms.length === 0) {
    return [{
      type: 'general',
      priority: 'low',
      title: 'Maintain Good Health Habits',
      description: 'Continue practicing healthy lifestyle habits to prevent illness.',
      actions: [
        'Get 7-9 hours of sleep nightly',
        'Stay hydrated (8 glasses of water daily)',
        'Exercise regularly (30 minutes, 5 days/week)',
        'Eat a balanced diet with fruits and vegetables',
        'Practice stress management techniques'
      ]
    }];
  }

  // Analyze symptom patterns
  const symptomNames = symptoms.map(s => s.name.toLowerCase());
  const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
  const highSeverityCount = symptoms.filter(s => s.severity >= 7).length;

  // High severity symptoms pattern
  if (highSeverityCount > 0) {
    recommendations.push({
      type: 'urgent',
      priority: 'high',
      title: 'Monitor High-Severity Symptoms',
      description: 'You have logged several high-severity symptoms. Consider medical consultation.',
      actions: [
        'Schedule appointment with healthcare provider',
        'Keep detailed symptom diary',
        'Monitor for worsening symptoms',
        'Have emergency contact information readily available'
      ]
    });
  }

  // Respiratory symptoms pattern
  const respiratorySymptoms = ['cough', 'shortness of breath', 'chest pain', 'sore throat'];
  if (symptomNames.some(s => respiratorySymptoms.some(rs => s.includes(rs)))) {
    recommendations.push({
      type: 'health',
      priority: 'medium',
      title: 'Respiratory Health Support',
      description: 'Support your respiratory system with these practices.',
      actions: [
        'Stay hydrated to thin mucus',
        'Use humidifier or breathe steam',
        'Avoid irritants like smoke',
        'Consider warm salt water gargles for sore throat',
        'Rest and avoid strenuous activity'
      ]
    });
  }

  // Pain management pattern
  const painSymptoms = ['headache', 'back pain', 'joint pain', 'muscle pain'];
  if (symptomNames.some(s => painSymptoms.some(ps => s.includes(ps)))) {
    recommendations.push({
      type: 'wellness',
      priority: 'medium',
      title: 'Pain Management Strategies',
      description: 'Natural approaches to help manage pain and discomfort.',
      actions: [
        'Apply heat or cold therapy as appropriate',
        'Practice gentle stretching or yoga',
        'Consider massage or physical therapy',
        'Maintain good posture',
        'Ensure adequate sleep for healing'
      ]
    });
  }

  // Stress-related symptoms pattern
  const stressSymptoms = ['headache', 'fatigue', 'insomnia', 'muscle tension'];
  if (symptomNames.some(s => stressSymptoms.some(ss => s.includes(ss))) && avgSeverity > 5) {
    recommendations.push({
      type: 'mental_health',
      priority: 'medium',
      title: 'Stress Management',
      description: 'Your symptoms may be stress-related. Consider these stress reduction techniques.',
      actions: [
        'Practice deep breathing exercises',
        'Try meditation or mindfulness',
        'Maintain regular exercise routine',
        'Ensure work-life balance',
        'Consider talking to a counselor if stress persists'
      ]
    });
  }

  // General wellness if no specific patterns
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'general',
      priority: 'low',
      title: 'Continue Monitoring Your Health',
      description: 'Keep tracking your symptoms and maintain healthy habits.',
      actions: [
        'Continue logging symptoms accurately',
        'Maintain regular sleep schedule',
        'Stay hydrated and eat nutritious foods',
        'Exercise as tolerated',
        'Contact healthcare provider if symptoms worsen'
      ]
    });
  }

  return recommendations;
}

module.exports = {
  analyzeSymptomsAndSuggest,
  getSuggestionForSymptom,
  getHealthRecommendations,
  getRulesInfo
};
