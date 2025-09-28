import { useState, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  HeartIcon,
  SparklesIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  SunIcon,
  MoonIcon,
  MinusIcon,
  PlusIcon,
  UserCircleIcon,
  Bars3BottomLeftIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid, 
  UserIcon as UserIconSolid,
  MicrophoneIcon as MicrophoneIconSolid 
} from '@heroicons/react/24/solid'
import api from '../utils/api'
import { useSocket } from '../contexts/SocketContext'
import { useTheme } from '../contexts/ThemeContext'
import LoadingSpinner from './LoadingSpinner'

// Quick reply suggestions for common symptoms
const quickReplies = [
  { label: '🤒 Fever', value: 'fever' },
  { label: '😷 Cough', value: 'cough' },
  { label: '🤕 Headache', value: 'headache' },
  { label: '🤢 Nausea', value: 'nausea' },
  { label: '😵 Dizziness', value: 'dizziness' },
  { label: '💪 Fatigue', value: 'fatigue' },
  { label: '🫁 Shortness of breath', value: 'shortness_of_breath' },
  { label: '🦴 Joint pain', value: 'joint_pain' }
]

// Emoji suggestions for expressive conversations
const emojiSuggestions = [
  '😊', '😟', '😰', '🤒', '🤕', '😷', '🤢', '😵', 
  '💪', '👍', '👎', '❤️', '💔', '🙏', '⚡', '🔥'
]

const SymptomChatbot = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [sessionData, setSessionData] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [suggestions, setSuggestions] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [manualMessage, setManualMessage] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
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

  // Voice input functionality
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    
    setIsListening(true)
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setManualMessage(transcript)
      setIsListening(false)
    }
    
    recognition.onerror = () => {
      setIsListening(false)
      alert('Voice recognition failed. Please try again.')
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.start()
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setManualMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Handle quick reply selection
  const handleQuickReply = (reply) => {
    if (currentQuestion) {
      handleAnswer(reply.value, reply.label)
    } else {
      // Send as manual message
      sendManualMessage(reply.label)
    }
    setShowQuickReplies(false)
  }

  // Send manual message
  const sendManualMessage = async (customMessage = null) => {
    const messageText = customMessage || manualMessage.trim()
    if (!messageText) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    if (!customMessage) setManualMessage('')
    
    // Bot response for manual messages
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "Thank you for sharing that. If you'd like a structured assessment, I can ask you specific questions about your symptoms. Would you like to continue with the guided questions?",
        timestamp: new Date(),
        avatar: '🩺'
      }])
    }, 1000)
  }

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
          content: "Hi there! 👋 I'm Dr. Helper, your AI medical assistant. I'll ask you a few questions to better understand your symptoms and provide personalized suggestions.",
          timestamp: new Date(),
          avatar: '🩺'
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
        timestamp: new Date(),
        avatar: '🩺'
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
        timestamp: new Date(),
        avatar: '🩺'
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
        timestamp: new Date(),
        avatar: '🩺'
      }])
    }
  }

  const showFinalResponse = (suggestions) => {
    const finalMessage = {
      id: Date.now(),
      type: 'bot',
      content: "Thank you for answering my questions! Based on your responses, here are my recommendations:",
      timestamp: new Date(),
      suggestions: suggestions,
      avatar: '🩺'
    }
    setMessages(prev => [...prev, finalMessage])
    
    // Save to backend
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
    setManualMessage('')
    setShowQuickReplies(true)
    initializeChat()
  }

  const TypingIndicator = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 via-white to-green-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-green-900/20 rounded-2xl rounded-bl-lg max-w-sm shadow-lg border border-blue-200/50 dark:border-blue-700/30"
    >
      {/* Enhanced Medical Avatar */}
      <motion.div 
        className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-lg">🩺</span>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </motion.div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <motion.div 
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div 
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
          </div>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Dr. Helper</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 italic font-medium">
          Analyzing your symptoms...
        </p>
      </div>
    </motion.div>
  )

  const MessageBubble = ({ message }) => {
    const isBot = message.type === 'bot'
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex items-start space-x-4 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
      >
        {/* Enhanced Avatar */}
        <motion.div 
          className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isBot 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isBot ? (
            <span className="text-lg">🩺</span>
          ) : (
            <span className="text-lg">👤</span>
          )}
          
          {/* Status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
            isBot ? 'bg-green-400' : 'bg-blue-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isBot ? 'bg-green-500' : 'bg-blue-500'
            } ${isBot ? 'animate-pulse' : ''}`} />
          </div>
        </motion.div>

        {/* Message Content */}
        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isBot ? '' : 'flex flex-col items-end'}`}>
          {/* Sender name */}
          <div className={`mb-1 ${isBot ? '' : 'text-right'}`}>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {isBot ? 'Dr. Helper' : 'You'}
            </span>
          </div>
          
          <motion.div 
            className={`p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
              isBot 
                ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-blue-900/20 rounded-bl-lg border border-blue-200/50 dark:border-blue-700/30' 
                : 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-lg shadow-green-500/25'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Healthcare accent line for bot messages */}
            {isBot && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500" />
            )}
            
            <p className={`text-sm leading-relaxed font-medium ${
              isBot ? 'text-gray-800 dark:text-gray-200' : 'text-white'
            }`}>
              {message.content}
            </p>

            {/* Enhanced Options for bot questions */}
            {message.options && (
              <div className="mt-5 space-y-3">
                {message.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.value, option.label)}
                    className="w-full text-left p-4 bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-blue-900/20 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/40 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group border border-blue-200/50 dark:border-blue-700/30 hover:border-blue-300 dark:hover:border-blue-600 transform"
                    style={{animationDelay: `${index * 0.1}s`}}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Option number badge */}
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800 group-hover:bg-blue-500 dark:group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-300 group-hover:text-white">
                          {index + 1}
                        </span>
                      </div>
                      
                      {/* Option text with hover effects */}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300 leading-relaxed">
                        {option.label}
                      </span>
                      
                      {/* Arrow indicator */}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Enhanced Suggestions display */}
            {message.suggestions && (
              <div className="mt-6 space-y-4">
                {message.suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    className={`relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
                      suggestion.urgency === 'high' 
                        ? 'bg-gradient-to-br from-red-50 via-red-50 to-red-100 dark:from-red-900/10 dark:via-red-800/20 dark:to-red-900/30 border border-red-200 dark:border-red-800/50' 
                        : suggestion.urgency === 'medium'
                        ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-amber-900/10 dark:via-yellow-800/20 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800/50'
                        : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-emerald-900/10 dark:via-green-800/20 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
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
                              {suggestion.title || suggestion.action}
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
                            {suggestion.description || suggestion.action}
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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-2 px-1 ${isBot ? '' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </motion.div>
    )
  }

  // Render floating chatbot or modal based on state
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => !isMinimized && onClose()}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30 backdrop-blur-md" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-2 sm:p-4 lg:p-6">
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
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isMinimized ? 0.3 : 1, 
                      y: isMinimized ? 300 : 0 
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    className={`w-full transform overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/30 flex flex-col ${
                      isMinimized 
                        ? 'max-w-xs h-20 cursor-pointer' 
                        : 'max-w-4xl h-[600px] lg:h-[700px]'
                    }`}
                    onClick={() => isMinimized && setIsMinimized(false)}
                  >
                    {isMinimized ? (
                      /* Minimized State */
                      <div className="flex items-center justify-center h-full">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <span className="text-2xl">🩺</span>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Dr. Helper
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Full Chatbot Interface */
                      <>
                        {/* Enhanced Header */}
                        <motion.div 
                          className="relative p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 overflow-hidden"
                          initial={{ y: -50 }}
                          animate={{ y: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {/* Medical Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 text-white text-2xl">🏥</div>
                            <div className="absolute top-4 right-16 text-white text-xl">💊</div>
                            <div className="absolute bottom-4 left-12 text-white text-lg">🔬</div>
                            <div className="absolute bottom-4 right-4 text-white text-xl">🩺</div>
                          </div>
                          
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.div 
                                className="relative p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg border border-white/30"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                              >
                                <span className="text-2xl">🩺</span>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>
                              </motion.div>
                              
                              <div>
                                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                                  <span>Dr. Helper</span>
                                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                                    AI Medical Assistant
                                  </span>
                                </h3>
                                <p className="text-blue-100 text-sm flex items-center space-x-2 mt-1">
                                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                  <span>Online • Here to help with your symptoms</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {/* Theme Toggle */}
                              <motion.button
                                onClick={toggleTheme}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Toggle theme"
                              >
                                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                              </motion.button>
                              
                              {/* Minimize Button */}
                              <motion.button
                                onClick={() => setIsMinimized(true)}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Minimize"
                              >
                                <MinusIcon className="w-5 h-5" />
                              </motion.button>
                              
                              {/* Reset Chat */}
                              {isComplete && (
                                <motion.button
                                  onClick={resetChat}
                                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Start new assessment"
                                >
                                  <SparklesIcon className="w-5 h-5" />
                                </motion.button>
                              )}
                              
                              {/* Close Button */}
                              <motion.button
                                onClick={onClose}
                                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 dark:from-blue-900/10 dark:via-gray-900 dark:to-green-900/10 relative">
                          {/* Healthcare Background Pattern */}
                          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
                            <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-500 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
                          </div>
                          
                          {/* Messages */}
                          <div className="relative z-10 space-y-6">
                            {messages.map((message) => (
                              <MessageBubble key={message.id} message={message} />
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && <TypingIndicator />}
                            
                            <div ref={messagesEndRef} />
                          </div>
                        </div>

                        {/* Quick Replies */}
                        {showQuickReplies && !currentQuestion && !isComplete && messages.length > 0 && (
                          <motion.div 
                            className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Quick Symptom Selection:
                              </span>
                              <button
                                onClick={() => setShowQuickReplies(false)}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                Hide
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {quickReplies.map((reply, index) => (
                                <motion.button
                                  key={reply.value}
                                  onClick={() => handleQuickReply(reply)}
                                  className="px-3 py-2 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  {reply.label}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Input Area */}
                        {!currentQuestion && !isComplete && (
                          <motion.div 
                            className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200/50 dark:border-gray-700/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex items-end space-x-3">
                              {/* Text Input */}
                              <div className="flex-1 relative">
                                <textarea
                                  value={manualMessage}
                                  onChange={(e) => setManualMessage(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendManualMessage())}
                                  placeholder="Describe your symptoms or ask a question..."
                                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                                  rows="1"
                                  style={{ minHeight: '48px' }}
                                />
                                
                                {/* Emoji Picker Button */}
                                <button
                                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                  <FaceSmileIcon className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Voice Input Button */}
                              <motion.button
                                onClick={startVoiceInput}
                                disabled={isListening}
                                className={`p-3 rounded-2xl transition-all duration-200 shadow-lg ${
                                  isListening 
                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-xl'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isListening ? (
                                  <MicrophoneIconSolid className="w-5 h-5" />
                                ) : (
                                  <MicrophoneIcon className="w-5 h-5" />
                                )}
                              </motion.button>

                              {/* Send Button */}
                              <motion.button
                                onClick={() => sendManualMessage()}
                                disabled={!manualMessage.trim()}
                                className="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <PaperAirplaneIcon className="w-5 h-5" />
                              </motion.button>
                            </div>

                            {/* Emoji Picker */}
                            <AnimatePresence>
                              {showEmojiPicker && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl"
                                >
                                  <div className="grid grid-cols-8 gap-2">
                                    {emojiSuggestions.map((emoji, index) => (
                                      <motion.button
                                        key={emoji}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                      >
                                        {emoji}
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}

                        {/* Completion Footer */}
                        {isComplete && (
                          <motion.div 
                            className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-t border-gray-200/50 dark:border-gray-700/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                  <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Assessment Complete! 🎉
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your health recommendations are ready
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex space-x-3">
                                <motion.button
                                  onClick={resetChat}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <SparklesIcon className="w-4 h-4 mr-2" />
                                  New Assessment
                                </motion.button>
                                
                                <motion.button
                                  onClick={() => {
                                    onClose()
                                    // Could integrate with symptom logging
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <HeartIcon className="w-4 h-4 mr-2" />
                                  Log Symptoms
                                </motion.button>
                              </div>
                            </div>
                            
                            {/* Trust Indicators */}
                            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span>HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <span>Medical Guidelines</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                                  <span>AI-Powered</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  )
}

export default SymptomChatbot
