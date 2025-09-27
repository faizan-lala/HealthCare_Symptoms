const express = require('express')
const router = express.Router()
const ChatbotEngine = require('../utils/chatbotEngine')
const ChatbotSuggestion = require('../models/ChatbotSuggestion')
const auth = require('../middleware/auth')

// Initialize chatbot engine
const chatbotEngine = new ChatbotEngine()

// Load rules on startup
chatbotEngine.loadRules().catch(console.error)

/**
 * @route   POST /api/chatbot/start
 * @desc    Start a new chatbot session
 * @access  Private
 */
router.post('/start', auth, async (req, res) => {
  try {
    // Create new session
    const session = chatbotEngine.createSession()
    
    // Get first question
    const firstQuestion = chatbotEngine.getFirstQuestion()
    
    if (!firstQuestion) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load initial question'
      })
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        firstQuestion: {
          id: firstQuestion.id,
          text: firstQuestion.text,
          type: firstQuestion.type,
          options: firstQuestion.options
        }
      }
    })
  } catch (error) {
    console.error('Error starting chatbot session:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start chatbot session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   POST /api/chatbot/answer
 * @desc    Process user answer and get next question or results
 * @access  Private
 */
router.post('/answer', auth, async (req, res) => {
  try {
    const { sessionId, questionId, answer, sessionData } = req.body

    if (!sessionId || !questionId || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, question ID, and answer are required'
      })
    }

    // Validate session exists
    const session = chatbotEngine.getSession(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or expired'
      })
    }

    // Process the answer
    const result = chatbotEngine.processAnswer(sessionId, questionId, answer)

    // Prepare response
    const responseData = {
      isComplete: result.isComplete,
      suggestions: result.suggestions
    }

    if (!result.isComplete && result.nextQuestion) {
      responseData.nextQuestion = {
        id: result.nextQuestion.id,
        text: result.nextQuestion.text,
        type: result.nextQuestion.type,
        options: result.nextQuestion.options
      }
    }

    res.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('Error processing chatbot answer:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process answer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   GET /api/chatbot/session/:sessionId
 * @desc    Get session details
 * @access  Private
 */
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params
    
    const session = chatbotEngine.getSession(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      })
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        currentQuestionId: session.currentQuestionId,
        isComplete: session.isComplete,
        startTime: session.startTime,
        answersCount: Object.keys(session.answers).length
      }
    })
  } catch (error) {
    console.error('Error getting session:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   DELETE /api/chatbot/session/:sessionId
 * @desc    End and delete a session
 * @access  Private
 */
router.delete('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params
    
    const session = chatbotEngine.getSession(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      })
    }

    chatbotEngine.deleteSession(sessionId)

    res.json({
      success: true,
      message: 'Session ended successfully'
    })
  } catch (error) {
    console.error('Error ending session:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to end session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   GET /api/chatbot/stats
 * @desc    Get chatbot usage statistics (admin only)
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = chatbotEngine.getSessionStats()
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error getting chatbot stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   POST /api/chatbot/cleanup
 * @desc    Clean up old sessions (admin only)
 * @access  Private
 */
router.post('/cleanup', auth, async (req, res) => {
  try {
    const { maxAgeMinutes = 60 } = req.body
    
    chatbotEngine.cleanupOldSessions(maxAgeMinutes)
    
    res.json({
      success: true,
      message: 'Cleanup completed successfully'
    })
  } catch (error) {
    console.error('Error cleaning up sessions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup sessions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   POST /api/chatbot/suggestions
 * @desc    Save chatbot suggestions to database
 * @access  Private
 */
router.post('/suggestions', auth, async (req, res) => {
  try {
    const { sessionId, suggestions, conversationSummary, userResponses, metadata } = req.body

    if (!sessionId || !suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and suggestions array are required'
      })
    }

    // Create new suggestion document
    const chatbotSuggestion = new ChatbotSuggestion({
      userId: req.user._id,
      sessionId,
      suggestions,
      conversationSummary: conversationSummary || '',
      userResponses: userResponses || new Map(),
      metadata: metadata || {}
    })

    await chatbotSuggestion.save()

    // emit real-time event to this user
    try {
      const io = req.app.get('io')
      if (io) {
        io.to(`user:${req.user._id}`).emit('chatbot:suggestionSaved', {
          id: chatbotSuggestion._id,
          createdAt: chatbotSuggestion.createdAt,
          suggestions: chatbotSuggestion.suggestions,
          conversationSummary: chatbotSuggestion.conversationSummary
        })
      }
    } catch (_) {}

    res.status(201).json({
      success: true,
      message: 'Suggestions saved successfully',
      data: {
        id: chatbotSuggestion._id,
        sessionId: chatbotSuggestion.sessionId,
        suggestionCount: chatbotSuggestion.suggestions.length,
        createdAt: chatbotSuggestion.createdAt
      }
    })
  } catch (error) {
    console.error('Error saving chatbot suggestions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   GET /api/chatbot/suggestions
 * @desc    Get user's chatbot suggestions history
 * @access  Private
 */
router.get('/suggestions', auth, async (req, res) => {
  try {
    const {
      limit = 20,
      skip = 0,
      urgency = null,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query

    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
      urgency,
      sortBy,
      sortOrder: parseInt(sortOrder)
    }

    const suggestions = await ChatbotSuggestion.getUserSuggestions(req.user._id, options)

    res.json({
      success: true,
      data: suggestions,
      pagination: {
        limit: options.limit,
        skip: options.skip,
        total: await ChatbotSuggestion.countDocuments({ userId: req.user._id })
      }
    })
  } catch (error) {
    console.error('Error fetching chatbot suggestions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   GET /api/chatbot/suggestions/stats
 * @desc    Get user's chatbot suggestions statistics
 * @access  Private
 */
router.get('/suggestions/stats', auth, async (req, res) => {
  try {
    const stats = await ChatbotSuggestion.getUserStats(req.user._id)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching suggestion stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestion statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   GET /api/chatbot/suggestions/:id
 * @desc    Get specific suggestion by ID
 * @access  Private
 */
router.get('/suggestions/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const suggestion = await ChatbotSuggestion.findOne({
      _id: id,
      userId: req.user._id
    })

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      })
    }

    res.json({
      success: true,
      data: suggestion
    })
  } catch (error) {
    console.error('Error fetching suggestion:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   DELETE /api/chatbot/suggestions/:id
 * @desc    Delete specific suggestion by ID
 * @access  Private
 */
router.delete('/suggestions/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const suggestion = await ChatbotSuggestion.findOneAndDelete({
      _id: id,
      userId: req.user._id
    })

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      })
    }

    res.json({
      success: true,
      message: 'Suggestion deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting suggestion:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete suggestion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Middleware to periodically clean up old sessions
setInterval(() => {
  try {
    chatbotEngine.cleanupOldSessions(60) // Clean up sessions older than 1 hour
  } catch (error) {
    console.error('Error in periodic cleanup:', error)
  }
}, 15 * 60 * 1000) // Run every 15 minutes

module.exports = router
