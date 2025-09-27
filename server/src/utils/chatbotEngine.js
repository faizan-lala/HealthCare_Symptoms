const fs = require('fs').promises
const path = require('path')

class ChatbotEngine {
  constructor() {
    this.rules = null
    this.sessions = new Map() // In-memory session storage (in production, use Redis or database)
  }

  async loadRules() {
    try {
      const rulesPath = path.join(__dirname, '../config/chatbot-rules.json')
      const rulesData = await fs.readFile(rulesPath, 'utf8')
      this.rules = JSON.parse(rulesData)
      console.log('🤖 Chatbot rules loaded successfully')
    } catch (error) {
      console.error('❌ Failed to load chatbot rules:', error)
      throw error
    }
  }

  createSession() {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session = {
      id: sessionId,
      currentQuestionId: 'fever_check', // Start with first question
      answers: {},
      startTime: new Date(),
      isComplete: false
    }
    
    this.sessions.set(sessionId, session)
    return session
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId)
  }

  deleteSession(sessionId) {
    this.sessions.delete(sessionId)
  }

  getQuestion(questionId) {
    if (!this.rules || !this.rules.questions) {
      throw new Error('Rules not loaded')
    }
    
    return this.rules.questions.find(q => q.id === questionId)
  }

  getFirstQuestion() {
    return this.getQuestion('fever_check')
  }

  processAnswer(sessionId, questionId, answer) {
    const session = this.getSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const question = this.getQuestion(questionId)
    if (!question) {
      throw new Error('Question not found')
    }

    // Store the answer
    session.answers[questionId] = answer
    
    // Determine next question
    const nextQuestionId = this.getNextQuestion(question, answer, session.answers)
    
    if (nextQuestionId === 'final' || !nextQuestionId) {
      // Assessment complete
      session.isComplete = true
      const suggestions = this.evaluateRules(session.answers)
      return {
        isComplete: true,
        suggestions,
        nextQuestion: null
      }
    } else {
      const nextQuestion = this.getQuestion(nextQuestionId)
      session.currentQuestionId = nextQuestionId
      return {
        isComplete: false,
        suggestions: null,
        nextQuestion
      }
    }
  }

  getNextQuestion(currentQuestion, answer, allAnswers) {
    if (!currentQuestion.next) {
      return 'final'
    }

    // Check for specific answer routing
    if (currentQuestion.next[answer]) {
      return currentQuestion.next[answer]
    }

    // Check for default routing
    if (currentQuestion.next.default) {
      return currentQuestion.next.default
    }

    // If no routing found, go to final
    return 'final'
  }

  evaluateRules(answers) {
    if (!this.rules || !this.rules.rules) {
      return [this.rules?.fallback || this.getDefaultFallback()]
    }

    const matchedRules = []

    // Evaluate each rule
    for (const rule of this.rules.rules) {
      if (this.evaluateRuleConditions(rule.conditions, answers)) {
        matchedRules.push({
          ...rule.result,
          ruleId: rule.id
        })
      }
    }

    // Sort by urgency (high, medium, low)
    const urgencyOrder = { high: 3, medium: 2, low: 1 }
    matchedRules.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency])

    // Return top 3 suggestions or fallback
    const suggestions = matchedRules.length > 0 
      ? matchedRules.slice(0, 3)
      : [this.rules.fallback || this.getDefaultFallback()]

    return suggestions
  }

  evaluateRuleConditions(conditions, answers) {
    for (const [key, expectedValues] of Object.entries(conditions)) {
      const userAnswer = answers[key]
      
      if (!userAnswer) {
        // If user didn't answer this question, condition not met
        continue
      }

      if (Array.isArray(expectedValues)) {
        // Multiple choice questions - check if user's answer is in expected values
        if (Array.isArray(userAnswer)) {
          // User gave multiple answers, check if any match
          const hasMatch = userAnswer.some(ans => expectedValues.includes(ans))
          if (!hasMatch) return false
        } else {
          // Single answer
          if (!expectedValues.includes(userAnswer)) return false
        }
      } else {
        // Single value expected
        if (Array.isArray(userAnswer)) {
          // User gave multiple answers, check if any match
          if (!userAnswer.includes(expectedValues)) return false
        } else {
          // Single answer
          if (userAnswer !== expectedValues) return false
        }
      }
    }
    
    return true
  }

  getDefaultFallback() {
    return {
      urgency: 'low',
      title: 'General Health Recommendations',
      description: 'Continue monitoring your symptoms and maintaining healthy habits.',
      reasoning: 'Based on your responses, no specific patterns requiring immediate attention were identified.',
      action: 'Rest, stay hydrated, and contact a healthcare provider if symptoms worsen'
    }
  }

  // Utility method to get session statistics
  getSessionStats() {
    const activeSessions = this.sessions.size
    const completedSessions = Array.from(this.sessions.values()).filter(s => s.isComplete).length
    
    return {
      activeSessions,
      completedSessions,
      totalSessions: activeSessions
    }
  }

  // Clean up old sessions (call periodically)
  cleanupOldSessions(maxAgeMinutes = 60) {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000)
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.startTime < cutoffTime) {
        this.sessions.delete(sessionId)
      }
    }
  }
}

module.exports = ChatbotEngine
