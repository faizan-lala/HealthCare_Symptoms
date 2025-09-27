import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  PlusIcon,
  HeartIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LightBulbIcon,
  ChatBubbleLeftEllipsisIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import api from '../utils/api'
import { useSocket } from '../contexts/SocketContext'
import { useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import SymptomChatbot from '../components/SymptomChatbot'
import SymptomHistorySidebar from '../components/SymptomHistorySidebar'
import { formatDate, formatDuration, getSeverityColorClass, getUrgencyColorClass } from '../utils/formatters'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/AnimatedCard'

const Dashboard = () => {
  const { user } = useAuth()
  const socket = useSocket()
  const queryClient = useQueryClient()
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false)

  // Fetch recent symptoms
  const { data: symptomsData, isLoading: symptomsLoading } = useQuery(
    'recent-symptoms',
    () => api.get('/symptoms?limit=5&sort=-createdAt'),
    { staleTime: 5 * 60 * 1000 }
  )

  // Fetch symptom stats
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'symptom-stats',
    () => api.get('/symptoms/stats'),
    { staleTime: 5 * 60 * 1000 }
  )

  // Fetch recent suggestions
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery(
    'recent-suggestions',
    () => api.post('/suggestions/analyze', { includeAll: false }),
    { staleTime: 10 * 60 * 1000 }
  )

  const symptoms = symptomsData?.data?.data?.symptoms || []
  const stats = statsData?.data?.data || {}
  const suggestions = suggestionsData?.data?.data?.suggestions || []
  // Real-time listeners
  useEffect(() => {
    if (!socket || !user?._id) return

    const invalidate = (keys) => keys.forEach((k) => queryClient.invalidateQueries(k))

    const onCreated = () => invalidate(['recent-symptoms','symptom-stats'])
    const onUpdated = () => invalidate(['recent-symptoms','symptom-stats'])
    const onDeleted = () => invalidate(['recent-symptoms','symptom-stats'])
    const onSuggestion = () => invalidate(['recent-suggestions'])

    socket.on('symptom:created', onCreated)
    socket.on('symptom:updated', onUpdated)
    socket.on('symptom:deleted', onDeleted)
    socket.on('chatbot:suggestionSaved', onSuggestion)

    return () => {
      socket.off('symptom:created', onCreated)
      socket.off('symptom:updated', onUpdated)
      socket.off('symptom:deleted', onDeleted)
      socket.off('chatbot:suggestionSaved', onSuggestion)
    }
  }, [socket, user?._id, queryClient])

  const quickStats = [
    {
      name: 'Total Symptoms',
      value: stats.stats?.totalSymptoms || 0,
      icon: HeartIcon,
      color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
    },
    {
      name: 'Active Symptoms',
      value: stats.stats?.activeSymptoms || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
    },
    {
      name: 'Resolved',
      value: stats.stats?.resolvedSymptoms || 0,
      icon: ChartBarIcon,
      color: 'text-success-600 bg-success-50 dark:bg-success-900/20'
    },
    {
      name: 'Recent (7 days)',
      value: stats.recentCount || 0,
      icon: ClockIcon,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
    }
  ]

  return (
    <div className="flex min-h-screen px-3 sm:px-4 lg:px-6">
      {/* Main Content */}
      <div className="flex-1 lg:mr-80">
        <div className="space-y-6">
          {/* Mobile history sidebar toggle */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setIsHistorySidebarOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg"
            >
              <Bars3Icon className="w-5 h-5 mr-2" />
              Symptom History
            </button>
          </div>

          {/* Welcome Section */}
      <div className="glass-card bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative px-6 py-8 text-white">
          <div className="animate-slide-down">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="animate-bounce-gentle">👋</span>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="mt-3 text-primary-100 text-lg">
              Let's check in on your health today. How are you feeling?
            </p>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link
              to="/symptoms/new"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Log New Symptom
            </Link>
            <Link
              to="/suggestions"
              className="inline-flex items-center px-6 py-3 border border-white/30 rounded-xl shadow-lg text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <LightBulbIcon className="mr-2 h-5 w-5" />
              Get AI Insights
            </Link>
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-white/30 rounded-xl shadow-lg text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <ChatBubbleLeftEllipsisIcon className="mr-2 h-5 w-5" />
              Ask Symptom Helper
            </button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Quick Stats */}
      <motion.div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-2"
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {quickStats.map((stat, index) => (
          <AnimatedCard key={stat.name} delay={index * 0.05} className="interactive-card overflow-hidden group">
            <div className="p-6 md:p-7">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300 origin-left">
                      {statsLoading ? (
                        <div className="h-8 w-12 pulse-loading rounded"></div>
                      ) : (
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                          {stat.value}
                        </span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transform transition-all duration-1000 ease-out"
                    style={{
                      width: statsLoading ? '0%' : `${Math.min((stat.value / Math.max(...quickStats.map(s => s.value))) * 100, 100)}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
        {/* Recent Symptoms */}
        <AnimatedCard className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Symptoms
              </h3>
              <Link
                to="/symptoms"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            {symptomsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-10 w-10 pulse-loading rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 pulse-loading rounded w-3/4"></div>
                      <div className="h-3 pulse-loading rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : symptoms.length > 0 ? (
              <div className="space-y-3">
                {symptoms.map((symptom) => (
                  <div key={symptom._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getSeverityColorClass(symptom.severity)}`}>
                        <HeartIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {symptom.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Severity: {symptom.severity}/10 • {formatDuration(symptom.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(symptom.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No symptoms logged yet
                  
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start tracking your health by logging your first symptom.
                </p>
                <div className="mt-6">
                  <Link
                    to="/symptoms/new"
                    className="btn btn-primary text-sm"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Log First Symptom
                  </Link>
                </div>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Recent Suggestions */}
        <AnimatedCard className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Health Insights
              </h3>
              <Link
                to="/suggestions"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-body">
            {suggestionsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 pulse-loading rounded w-full"></div>
                    <div className="h-3 pulse-loading rounded w-3/4"></div>
                    <div className="h-3 pulse-loading rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getUrgencyColorClass(suggestion.urgency)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {suggestion.action}
                        </h4>
                        <p className="mt-1 text-xs opacity-90">
                          {suggestion.reasoning}
                        </p>
                      </div>
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/20">
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No insights available
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Log some symptoms to get personalized health insights.
                </p>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <AnimatedCard className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/symptoms/new"
              className="group flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <PlusIcon className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  Log Symptom
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  Track new symptoms
                </p>
              </div>
            </Link>

            <Link
              to="/symptoms"
              className="group flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <HeartIcon className="h-8 w-8 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  View History
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review past symptoms
                </p>
              </div>
            </Link>

            <Link
              to="/suggestions"
              className="group flex items-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-warning-600 group-hover:text-warning-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-warning-900 dark:text-warning-100">
                  Get Insights
                </p>
                <p className="text-xs text-warning-600 dark:text-warning-400">
                  Analyze symptoms
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="group flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <HeartIcon className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Profile
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Update settings
                </p>
              </div>
            </Link>
          </div>
        </div>
      </AnimatedCard>
        </div>
      </div>

      {/* Symptom History Sidebar - Desktop */}
      <div className="hidden lg:block fixed right-0 top-0 h-full w-80 z-30">
        <SymptomHistorySidebar 
          isOpen={true}
          onClose={() => {}}
        />
      </div>

      {/* Symptom History Sidebar - Mobile */}
      <SymptomHistorySidebar 
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
      />

      {/* Symptom Chatbot Modal */}
      <SymptomChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  )
}

export default Dashboard
