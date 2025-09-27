const mongoose = require('mongoose')

const chatbotSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  suggestions: [{
    action: {
      type: String,
      required: true
    },
    reasoning: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ['routine', 'medium', 'high'],
      default: 'routine'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    category: {
      type: String,
      default: 'general'
    }
  }],
  conversationSummary: {
    type: String,
    required: false
  },
  userResponses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  metadata: {
    totalQuestions: {
      type: Number,
      default: 0
    },
    answeredQuestions: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number, // in seconds
      default: 0
    },
    rulesTriggered: [{
      ruleId: String,
      ruleName: String,
      confidence: Number
    }]
  }
}, {
  timestamps: true
})

// Index for efficient querying
chatbotSuggestionSchema.index({ userId: 1, createdAt: -1 })
chatbotSuggestionSchema.index({ sessionId: 1 })
chatbotSuggestionSchema.index({ 'suggestions.urgency': 1 })

// Virtual for suggestion count
chatbotSuggestionSchema.virtual('suggestionCount').get(function() {
  return this.suggestions ? this.suggestions.length : 0
})

// Static method to get user's recent suggestions
chatbotSuggestionSchema.statics.getUserSuggestions = async function(userId, options = {}) {
  const {
    limit = 20,
    skip = 0,
    urgency = null,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options

  const query = { userId: new mongoose.Types.ObjectId(userId) }
  
  if (urgency) {
    query['suggestions.urgency'] = urgency
  }

  const sort = {}
  sort[sortBy] = sortOrder

  return this.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean()
}

// Static method to get suggestion statistics
chatbotSuggestionSchema.statics.getUserStats = async function(userId) {
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$suggestions' },
    {
      $group: {
        _id: '$suggestions.urgency',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$suggestions.confidence' }
      }
    }
  ]

  const urgencyStats = await this.aggregate(pipeline)
  
  const totalSuggestions = await this.countDocuments({ userId: new mongoose.Types.ObjectId(userId) })
  
  return {
    totalSuggestions,
    urgencyBreakdown: urgencyStats,
    recentActivity: await this.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(7)
      .lean()
  }
}

// Instance method to add a suggestion
chatbotSuggestionSchema.methods.addSuggestion = function(suggestion) {
  this.suggestions.push(suggestion)
  return this.save()
}

// Instance method to update metadata
chatbotSuggestionSchema.methods.updateMetadata = function(metadata) {
  this.metadata = { ...this.metadata, ...metadata }
  return this.save()
}

module.exports = mongoose.model('ChatbotSuggestion', chatbotSuggestionSchema)