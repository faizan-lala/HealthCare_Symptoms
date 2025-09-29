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
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid'
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
  const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
  const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const hoverTap = { whileHover: { y: -2 }, whileTap: { scale: 0.98 } }
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

  // Compute max for progress bars after quickStats is defined
  const maxStatValue = Math.max(...quickStats.map(s => s.value || 0), 1)

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 lg:mr-96 lg:pr-4">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Modern Dashboard Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
              {/* Modern Header Section */}
              <motion.div 
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Welcome Section */}
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center gap-3 mb-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span className="text-2xl">👋</span>
                    </motion.div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name?.split(' ')[0]}!
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                        Let's check in on your health today
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Modern Search Bar */}
                  <motion.div 
                    className="relative max-w-md"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="relative group">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="search"
                        placeholder="Search symptoms or ask Dr. Helper..."
                        className="w-full pl-12 pr-14 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                      />
                      <motion.button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SparklesIcon className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* User Profile Section */}
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.stats?.totalSymptoms || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.stats?.resolvedSymptoms || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Resolved</div>
                    </div>
                  </div>
                  
                  {/* Profile */}
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="w-10 h-10 rounded-xl bg-white/20 border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Health Dashboard
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* Modern Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Primary Action - Log Symptom */}
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/symptoms/new"
                    className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="mr-3"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </motion.div>
                    <span className="text-sm font-medium">Log New Symptom</span>
                  </Link>
                </motion.div>
                
                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/suggestions"
                      className="inline-flex items-center justify-center px-5 py-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 group"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="mr-2"
                      >
                        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                      <span className="text-sm font-medium">AI Insights</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => setIsChatbotOpen(true)}
                      className="inline-flex items-center justify-center px-5 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                        className="mr-2"
                      >
                        <span className="text-lg">🩺</span>
                      </motion.div>
                      <span className="text-sm font-medium">Dr. Helper</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Modern Dashboard Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
            initial="hidden" 
            animate="show" 
            variants={listVariants}
          >
            {quickStats.map((stat, index) => (
              <motion.div 
                key={stat.name} 
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10' 
                      : index === 1
                      ? 'bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10'
                      : index === 2
                      ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10'
                      : 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10'
                  }`} />
                  
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.div 
                        className={`p-4 rounded-2xl shadow-lg ${stat.color}`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <stat.icon className="h-8 w-8" />
                      </motion.div>
                      
                      <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        index === 0 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                          : index === 1
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : index === 2
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      }`}>
                        Week
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {stat.name}
                    </h3>
                    
                    {/* Value and Status */}
                    <div className="flex items-center justify-between mb-6">
                      {statsLoading ? (
                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ) : (
                        <motion.span 
                          className={`text-4xl font-bold ${
                            index === 0 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : index === 1
                              ? 'text-orange-600 dark:text-orange-400'
                              : index === 2
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-purple-600 dark:text-purple-400'
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          {stat.value}
                        </motion.span>
                      )}
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">items</div>
                        <div className={`text-sm font-semibold ${
                          index === 0 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : index === 1
                            ? 'text-orange-600 dark:text-orange-400'
                            : index === 2
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {index === 0 ? 'Tracked' : index === 2 && stat.value === 0 ? 'All Clear' : 'Monitor'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                          {index === 0 ? 'Health Progress' : 'Severity Level'}
                        </span>
                        <span className={`text-sm font-bold ${
                          index === 0 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : index === 1
                            ? 'text-orange-600 dark:text-orange-400'
                            : index === 2
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {Math.round((stat.value / Math.max(maxStatValue, 1)) * 100)}%
                        </span>
                      </div>
                      
                      <div className="relative w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className={`absolute inset-0 rounded-full ${
                            index === 0 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : index === 1
                              ? 'bg-gradient-to-r from-orange-500 to-red-500'
                              : index === 2
                              ? stat.value === 0 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: statsLoading ? '0%' : `${Math.min((stat.value / Math.max(maxStatValue, 1)) * 100, 100)}%`
                          }}
                          transition={{ 
                            duration: 1, 
                            ease: 'easeOut', 
                            delay: 0.4 + index * 0.05 
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                          {index === 0 ? (
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                          ) : (
                            <HeartIcon className="h-5 w-5" />
                          )}
                          <span className="text-sm font-semibold">
                            {index === 0 ? 'Tracking wellness' : 'Monitor health'}
                          </span>
                        </div>
                        
                        <span className={`text-sm font-bold ${
                          index === 0 
                            ? 'text-blue-500 dark:text-blue-400' 
                            : index === 1
                            ? 'text-orange-500 dark:text-orange-400'
                            : index === 2
                            ? 'text-green-500 dark:text-green-400'
                            : 'text-purple-500 dark:text-purple-400'
                        }`}>
                          {index === 0 
                            ? 'Active' 
                            : index === 2 && stat.value === 0
                            ? 'Healthy' 
                            : stat.value <= 2 
                              ? 'Low Risk' 
                              : 'Attention'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Enhanced Recent Symptoms */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                {/* Gradient Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.div 
                  className="absolute top-4 right-4 w-20 h-20 bg-red-400/10 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Clean Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="p-2 bg-red-500 rounded-lg shadow-sm"
                    >
                      <HeartIconSolid className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Recent Symptoms
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Track your health journey
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/symptoms"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                    >
                      <span>View all</span>
                      <ChartBarIcon className="h-3 w-3" />
                    </Link>
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  {symptomsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : symptoms.length > 0 ? (
                    <motion.div className="space-y-4" initial="hidden" animate="show" variants={listVariants}>
                      {symptoms.map((symptom) => (
                        <motion.div 
                          key={symptom._id} 
                          variants={itemVariants} 
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-white/70 to-gray-50/70 dark:from-gray-700/70 dark:to-gray-600/70 rounded-xl hover:from-red-50/70 hover:to-pink-50/70 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 hover:border-red-200/50 dark:hover:border-red-700/50"
                          whileHover={{ scale: 1.01, y: -1 }}
                        >
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className={`p-2 rounded-lg ${getSeverityColorClass(symptom.severity)}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <HeartIcon className="h-4 w-4" />
                            </motion.div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {symptom.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Severity: <span className="font-medium">{symptom.severity}/10</span> • {formatDuration(symptom.duration)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(symptom.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
                      >
                        <HeartIcon className="h-8 w-8 text-gray-400" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No symptoms logged yet
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Start tracking your health by logging your first symptom.
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/symptoms/new"
                          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
                        >
                          <PlusIcon className="mr-2 h-5 w-5" />
                          Log First Symptom
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Health Insights */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
                {/* Gradient Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.div 
                  className="absolute top-4 right-4 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                
                {/* Optimized Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="relative p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md"
                    >
                      <LightBulbIcon className="h-5 w-5 text-white relative z-10" />
                      {/* Subtle sparkle effect */}
                      <motion.div 
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full opacity-70"
                        animate={{ 
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Health Insights
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        AI recommendations
                      </p>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/suggestions"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200"
                    >
                      <span>View all</span>
                      <SparklesIcon className="h-3 w-3" />
                    </Link>
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  {suggestionsLoading ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <motion.div className="space-y-4" initial="hidden" animate="show" variants={listVariants}>
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className={`p-4 rounded-xl border-l-4 ${getUrgencyColorClass(suggestion.urgency)} bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200`}
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                {suggestion.action}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                {suggestion.reasoning}
                              </p>
                            </div>
                            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                              {suggestion.confidence}% confidence
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
                      >
                        <ChartBarIcon className="h-8 w-8 text-gray-400" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No insights available
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Log some symptoms to get personalized health insights.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-600/30">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl"
                  >
                    <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <motion.div 
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2" 
                  initial="hidden" 
                  animate="show" 
                  variants={listVariants}
                >
                  {[
                    { to: "/symptoms/new", icon: PlusIcon, title: "Log Symptom", desc: "Track new symptoms", color: "primary" },
                    { to: "/symptoms", icon: HeartIcon, title: "View History", desc: "Review past symptoms", color: "gray" },
                    { to: "/suggestions", icon: LightBulbIcon, title: "Get Insights", desc: "Analyze symptoms", color: "purple" },
                    { to: "/profile", icon: ClockIcon, title: "Profile", desc: "Update settings", color: "green" }
                  ].map((action, index) => (
                    <motion.div 
                      key={action.to} 
                      variants={itemVariants} 
                      className="group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={action.to}
                        className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                          action.color === 'primary' ? 'bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30' :
                          action.color === 'gray' ? 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-600/50' :
                          action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30' :
                          'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`p-3 rounded-xl ${
                            action.color === 'primary' ? 'bg-primary-100 dark:bg-primary-800/50' :
                            action.color === 'gray' ? 'bg-gray-100 dark:bg-gray-600' :
                            action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800/50' :
                            'bg-green-100 dark:bg-green-800/50'
                          }`}
                        >
                          <action.icon className={`h-6 w-6 ${
                            action.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                            action.color === 'gray' ? 'text-gray-600 dark:text-gray-400' :
                            action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                            'text-green-600 dark:text-green-400'
                          }`} />
                        </motion.div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {action.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {action.desc}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Symptom History Sidebar - Desktop */}
      <div className="hidden lg:block fixed right-0 top-20 h-[calc(100vh-5rem)] w-96 z-30">
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
