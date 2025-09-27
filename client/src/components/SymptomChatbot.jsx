import { useState, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  HeartIcon,
  SparklesIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import api from '../utils/api'
import { useSocket } from '../contexts/SocketContext'
import LoadingSpinner from './LoadingSpinner'

const SymptomChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [sessionData, setSessionData] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [suggestions, setSuggestions] = useState(null)
  const messagesEndRef = useRef(null)
  const socket = useSocket()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  const initializeChat = async () => {
    try {
      setIsTyping(true)
      const response = await api.post('/chatbot/start')
      const { sessionId: newSessionId, firstQuestion } = response.data.data
      
      setSessionId(newSessionId)
      
      // Simulate typing delay
      setTimeout(() => {
        setMessages([{
          id: 1,
          type: 'bot',
          content: "Hi there! 👋 I'm your Symptom Helper. I'll ask you a few questions to better understand your symptoms and provide personalized suggestions.",
          timestamp: new Date()
        }])
        setIsTyping(false)
        
        // Show first question after welcome message
        setTimeout(() => {
          showQuestion(firstQuestion)
        }, 1000)
      }, 1500)
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      setIsTyping(false)
      setMessages([{
        id: 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date()
      }])
    }
  }

  const showQuestion = (question) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: question.text,
        options: question.options,
        questionId: question.id,
        timestamp: new Date()
      }])
      setCurrentQuestion(question)
      setIsTyping(false)
    }, 1000)
  }

  const handleAnswer = async (answer, answerText) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: answerText || answer,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setCurrentQuestion(null)

    try {
      setIsTyping(true)
      const response = await api.post('/chatbot/answer', {
        sessionId,
        questionId: currentQuestion.id,
        answer,
        sessionData: { ...sessionData, [currentQuestion.id]: answer }
      })

      const { nextQuestion, isComplete: complete, suggestions: chatSuggestions } = response.data.data
      
      setSessionData(prev => ({ ...prev, [currentQuestion.id]: answer }))

      setTimeout(() => {
        setIsTyping(false)
        
        if (complete) {
          setIsComplete(true)
          setSuggestions(chatSuggestions)
          showFinalResponse(chatSuggestions)
        } else if (nextQuestion) {
          showQuestion(nextQuestion)
        }
      }, 1500)
    } catch (error) {
      console.error('Failed to process answer:', error)
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "Sorry, I encountered an error. Let me try to continue...",
        timestamp: new Date()
      }])
    }
  }

  const showFinalResponse = (suggestions) => {
    const finalMessage = {
      id: Date.now(),
      type: 'bot',
      content: "Thank you for answering my questions! Based on your responses, here are my suggestions:",
      timestamp: new Date(),
      suggestions: suggestions
    }
    setMessages(prev => [...prev, finalMessage])
    // persist to backend
    try {
      api.post('/chatbot/suggestions', {
        sessionId,
        suggestions: (suggestions || []).map(s => ({
          action: s.title || s.action || 'Recommendation',
          reasoning: s.reasoning || s.description || '',
          urgency: s.urgency || 'routine',
          confidence: s.confidence || 70
        })),
        conversationSummary: `Completed assessment with ${Object.keys(sessionData).length} answers`,
        userResponses: sessionData,
        metadata: {
          totalQuestions: Object.keys(sessionData).length,
          answeredQuestions: Object.keys(sessionData).length
        }
      })
    } catch (_) {}
  }

  const resetChat = () => {
    setMessages([])
    setCurrentQuestion(null)
    setIsTyping(false)
    setSessionData({})
    setSessionId(null)
    setIsComplete(false)
    setSuggestions(null)
    initializeChat()
  }

  const TypingIndicator = () => (
    <div className="flex items-center space-x-3 p-5 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl rounded-bl-sm max-w-xs animate-slide-up shadow-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg">
        <HeartIconSolid className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-1">
          <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">Analyzing your response...</p>
      </div>
    </div>
  )

  const MessageBubble = ({ message }) => {
    const isBot = message.type === 'bot'
    
    return (
      <div className={`flex items-start space-x-3 animate-slide-up ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isBot 
            ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
            : 'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          {isBot ? (
            <HeartIconSolid className="w-4 h-4 text-white" />
          ) : (
            <UserIcon className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`max-w-xs lg:max-w-md ${isBot ? '' : 'flex flex-col items-end'}`}>
          <div className={`p-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
            isBot 
              ? 'bg-white dark:bg-gray-700 rounded-bl-sm' 
              : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm'
          }`}>
            <p className={`text-sm leading-relaxed ${isBot ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
              {message.content}
            </p>

            {/* Enhanced Options for bot questions */}
            {message.options && (
              <div className="mt-5 space-y-3">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value, option.label)}
                    className="w-full text-left p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-600 dark:to-gray-700 hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/30 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group border border-gray-200 dark:border-gray-500 hover:border-primary-300 dark:hover:border-primary-600 transform animate-slide-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Option number badge */}
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-500 group-hover:bg-primary-500 dark:group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-white">
                          {index + 1}
                        </span>
                      </div>
                      
                      {/* Option text with hover effects */}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300 leading-relaxed">
                        {option.label}
                      </span>
                      
                      {/* Arrow indicator */}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Subtle bottom border animation */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-500 ease-out"></div>
                  </button>
                ))}
              </div>
            )}

            {/* Enhanced Suggestions display */}
            {message.suggestions && (
              <div className="mt-6 space-y-4">
                {message.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className={`relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 animate-slide-left ${
                      suggestion.urgency === 'high' 
                        ? 'bg-gradient-to-br from-red-50 via-red-50 to-red-100 dark:from-red-900/10 dark:via-red-800/20 dark:to-red-900/30 border border-red-200 dark:border-red-800/50' 
                        : suggestion.urgency === 'medium'
                        ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-amber-900/10 dark:via-yellow-800/20 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50'
                        : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-emerald-900/10 dark:via-green-800/20 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/50'
                    }`}
                    style={{animationDelay: `${index * 0.15}s`}}
                  >
                    {/* Urgency indicator bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      suggestion.urgency === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      suggestion.urgency === 'medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      'bg-gradient-to-r from-emerald-500 to-green-500'
                    }`}></div>
                    
                    <div className="p-5">
                      <div className="flex items-start space-x-4">
                        {/* Enhanced icon with pulse effect */}
                        <div className={`relative p-3 rounded-xl shadow-md ${
                          suggestion.urgency === 'high' ? 'bg-red-500' :
                          suggestion.urgency === 'medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}>
                          {suggestion.urgency === 'high' ? (
                            <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                          ) : suggestion.urgency === 'medium' ? (
                            <SparklesIcon className="w-6 h-6 text-white" />
                          ) : (
                            <CheckIcon className="w-6 h-6 text-white" />
                          )}
                          
                          {/* Pulse effect for high urgency */}
                          {suggestion.urgency === 'high' && (
                            <div className="absolute inset-0 rounded-xl bg-red-400 opacity-75 animate-ping"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Title with urgency badge */}
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                              {suggestion.title}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              suggestion.urgency === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                              suggestion.urgency === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                            }`}>
                              {suggestion.urgency}
                            </span>
                          </div>
                          
                          {/* Description with better typography */}
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 font-medium">
                            {suggestion.description}
                          </p>
                          
                          {/* Reasoning in a callout box */}
                          {suggestion.reasoning && (
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/50">
                              <div className="flex items-start space-x-2">
                                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
                                  <HeartIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                  <span className="font-semibold not-italic">Medical Reasoning:</span> {suggestion.reasoning}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Action button for high priority items */}
                          {suggestion.urgency === 'high' && (
                            <div className="mt-4">
                              <button className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors duration-200 shadow-sm">
                                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                                Take Action Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative corner element */}
                    <div className={`absolute bottom-0 right-0 w-16 h-16 opacity-10 ${
                      suggestion.urgency === 'high' ? 'text-red-500' :
                      suggestion.urgency === 'medium' ? 'text-amber-500' :
                      'text-emerald-500'
                    }`}>
                      {suggestion.urgency === 'high' ? (
                        <ExclamationTriangleIcon className="w-full h-full" />
                      ) : suggestion.urgency === 'medium' ? (
                        <SparklesIcon className="w-full h-full" />
                      ) : (
                        <CheckIcon className="w-full h-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${isBot ? '' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 lg:p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-2xl md:max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl"
              >
                {/* Enhanced Header */}
                <div className="relative p-6 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg border border-white/30">
                          <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-white" />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                          <span>Symptom Helper</span>
                          <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                            AI
                          </div>
                        </h3>
                        <p className="text-primary-100 text-sm flex items-center space-x-2 mt-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          <span>Online • Ready to help</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isComplete && (
                        <button
                          onClick={resetChat}
                          className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                          title="Start new conversation"
                        >
                          <SparklesIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-20 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
                  <div className="absolute bottom-4 left-20 w-6 h-6 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Enhanced Chat Messages Area */}
                <div className="h-[28rem] sm:h-[32rem] lg:h-[36rem] overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
                  </div>
                  
                  {/* Messages container */}
                  <div className="relative z-10 space-y-6">
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start space-x-3">
                        <TypingIndicator />
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Enhanced Footer */}
                {isComplete && (
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                          <SparklesIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Assessment Complete!
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Would you like to save these symptoms for tracking?
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={resetChat}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
                        >
                          <ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2" />
                          Ask Again
                        </button>
                        <button
                          onClick={() => {
                            onClose()
                            // Could integrate with symptom logging here
                          }}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          <HeartIcon className="w-4 h-4 mr-2" />
                          Log Symptoms
                        </button>
                      </div>
                    </div>
                    
                    {/* Additional helpful info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <CheckIcon className="w-3 h-3" />
                          <span>Secure & Private</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-3 h-3" />
                          <span>Medical Guidelines</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SparklesIcon className="w-3 h-3" />
                          <span>AI-Powered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SymptomChatbot
