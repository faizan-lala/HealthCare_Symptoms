import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import {
  XMarkIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import api from '../utils/api'
import { useSocket } from '../contexts/SocketContext'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '../utils/formatters'

const SymptomHistorySidebar = ({ isOpen, onClose }) => {
  const [expandedCards, setExpandedCards] = useState(new Set())
  const [filter, setFilter] = useState('all') // 'all', 'high', 'medium', 'routine'
  const socket = useSocket()
  const queryClient = useQueryClient()

  // Fetch chatbot suggestions
  const { data: suggestionsData, isLoading, refetch } = useQuery(
    'chatbot-suggestions',
    () => api.get('/chatbot/suggestions'),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: isOpen // Only fetch when sidebar is open
    }
  )

  const suggestions = suggestionsData?.data?.data || []

  // Normalize backend urgency values to UI categories
  const categorizeUrgency = (urgency) => {
    const u = (urgency || '').toLowerCase()
    if (u === 'emergency' || u === 'urgent' || u === 'high') return 'high'
    if (u === 'moderate' || u === 'medium') return 'medium'
    // treat 'routine' and 'mild' as routine
    return 'routine'
  }

  // Filter suggestions based on urgency category
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true
    return suggestion.suggestions?.some(s => categorizeUrgency(s.urgency) === filter)
  })

  const toggleCard = (suggestionId) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(suggestionId)) {
      newExpanded.delete(suggestionId)
    } else {
      newExpanded.add(suggestionId)
    }
    setExpandedCards(newExpanded)
  }

  const getUrgencyIcon = (urgency) => {
    switch (categorizeUrgency(urgency)) {
      case 'high':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      case 'medium':
        return <InformationCircleIcon className="w-4 h-4 text-yellow-500" />
      case 'routine':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      default:
        return <InformationCircleIcon className="w-4 h-4 text-blue-500" />
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (categorizeUrgency(urgency)) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'routine':
      default:
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/10'
    }
  }

  // Auto-refresh when new suggestions might be available
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        refetch()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen, refetch])

  // Real-time: refresh when new suggestions saved
  useEffect(() => {
    if (!socket) return
    const onSuggestion = () => queryClient.invalidateQueries('chatbot-suggestions')
    socket.on('chatbot:suggestionSaved', onSuggestion)
    return () => socket.off('chatbot:suggestionSaved', onSuggestion)
  }, [socket, queryClient])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:translate-x-0 lg:shadow-none lg:relative lg:z-30 flex flex-col`}>
        
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ClockIcon className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-white">Symptom History</h2>
          </div>
          <motion.button
            onClick={onClose}
            className="lg:hidden p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="p-6 border-b border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex space-x-2 bg-gray-100/80 dark:bg-gray-700/50 rounded-xl p-2 backdrop-blur-sm">
            {[
              { value: 'all', label: 'All', count: suggestions.length },
              { value: 'high', label: 'High', count: suggestions.filter(s => s.suggestions?.some(sg => categorizeUrgency(sg.urgency) === 'high')).length },
              { value: 'medium', label: 'Medium', count: suggestions.filter(s => s.suggestions?.some(sg => categorizeUrgency(sg.urgency) === 'medium')).length },
              { value: 'routine', label: 'Routine', count: suggestions.filter(s => s.suggestions?.some(sg => categorizeUrgency(sg.urgency) === 'routine')).length }
            ].map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 relative ${
                  filter === tab.value
                    ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-lg shadow-primary-500/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/50 dark:hover:bg-gray-600/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="block">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    filter === tab.value 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} className="animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </motion.div>
              ))}
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <AnimatePresence initial={false}>
            {filteredSuggestions.map((suggestionGroup, index) => (
              <motion.div
                key={suggestionGroup._id || index}
                initial={{opacity:0, y:8}}
                animate={{opacity:1, y:0}}
                exit={{opacity:0, y:-8}}
                className="card border-l-4 border-l-primary-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(suggestionGroup.createdAt)}
                        </span>
                      </div>
                      {suggestionGroup.conversationSummary && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {suggestionGroup.conversationSummary}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleCard(suggestionGroup._id)}
                      className="ml-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {expandedCards.has(suggestionGroup._id) ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Suggestions Preview */}
                  {!expandedCards.has(suggestionGroup._id) && suggestionGroup.suggestions && (
                    <div className="space-y-2">
                      {suggestionGroup.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                        <div
                          key={suggestionIndex}
                          className={`p-3 rounded-lg border-l-4 ${getUrgencyColor(suggestion.urgency)}`}
                        >
                          <div className="flex items-start space-x-2">
                            {getUrgencyIcon(suggestion.urgency)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                {suggestion.action}
                              </p>
                              {suggestion.confidence && (
                                <span className="inline-flex items-center px-2 py-1 mt-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                                  {suggestion.confidence}% confidence
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {suggestionGroup.suggestions.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{suggestionGroup.suggestions.length - 2} more suggestions
                        </p>
                      )}
                    </div>
                  )}

                  {/* Expanded Content */}
                  {expandedCards.has(suggestionGroup._id) && suggestionGroup.suggestions && (
                    <div className="space-y-3">
                      {suggestionGroup.suggestions.map((suggestion, suggestionIndex) => (
                        <div
                          key={suggestionIndex}
                          className={`p-4 rounded-lg border-l-4 ${getUrgencyColor(suggestion.urgency)}`}
                        >
                          <div className="flex items-start space-x-3">
                            {getUrgencyIcon(suggestion.urgency)}
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                {suggestion.action}
                              </h4>
                              {suggestion.reasoning && (
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                  {suggestion.reasoning}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                {suggestion.confidence && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                                    {suggestion.confidence}% confidence
                                  </span>
                                )}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  categorizeUrgency(suggestion.urgency) === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                  categorizeUrgency(suggestion.urgency) === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                }`}>
                                  {categorizeUrgency(suggestion.urgency)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No suggestions yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Use the Symptom Helper chatbot to get personalized health suggestions.
              </p>
              <button
                onClick={onClose}
                className="btn btn-primary text-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Suggestions are based on reported symptoms and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </>
  )
}

export default SymptomHistorySidebar