import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  XMarkIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { DashboardSkeleton } from '../components/SkeletonLoader'
import { 
  formatDate, 
  formatDuration, 
  formatSeverity, 
  getSeverityColorClass,
  getStatusColorClass,
  formatStatus
} from '../utils/formatters'

const Symptoms = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    severity: '',
    page: 1,
    limit: 10
  })

  const { data, isLoading, error } = useQuery(
    ['symptoms', filters],
    () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) return
        // Backend expects 'name' for text search
        const paramKey = key === 'search' ? 'name' : key
        params.append(paramKey, value)
      })
      return api.get(`/symptoms?${params.toString()}`)
    },
    { keepPreviousData: true }
  )

  const symptoms = data?.data?.data?.symptoms || []
  const pagination = data?.data?.data?.pagination || {}

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-danger-600 dark:text-danger-400 mb-4">
          <HeartIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Failed to load symptoms
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {error.response?.data?.message || 'Something went wrong'}
        </p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const activeFiltersCount = [filters.search, filters.status, filters.severity].filter(Boolean).length

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-red-400/10 rounded-full blur-3xl" />
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute top-8 right-12 w-16 h-16 bg-white/10 rounded-full blur-2xl"
              animate={{ 
                y: [-8, 12, -8], 
                x: [-4, 6, -4],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-8 left-12 w-12 h-12 bg-red-400/20 rounded-full blur-xl"
              animate={{ 
                y: [8, -12, 8], 
                x: [4, -6, 4],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            {/* Medical Icons */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-2xl">🩺</div>
              <div className="absolute top-8 right-16 text-xl">📋</div>
              <div className="absolute bottom-8 left-16 text-lg">💊</div>
              <div className="absolute bottom-4 right-8 text-xl">🏥</div>
              <div className="absolute top-1/2 left-1/4 text-sm">❤️</div>
              <div className="absolute top-1/3 right-1/3 text-sm">⚡</div>
            </div>
          </div>
          
          <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-gray-900 dark:text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span className="text-2xl">❤️</span>
                    </motion.div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Symptom History
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                        Track and manage your health symptoms over time
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Quick Stats */}
                <motion.div 
                  className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {pagination.total || 0} Total Symptoms
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Health Journey
                    </span>
                  </div>
                  {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-xl border border-yellow-300/30">
                      <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-2 sm:gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/symptoms/new"
                    className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="mr-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </motion.div>
                    <span className="text-sm font-medium">Log New Symptom</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/suggestions"
                    className="inline-flex items-center justify-center px-5 py-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="text-sm font-medium">Get AI Insights</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/50 to-purple-50/50 dark:from-blue-900/10 dark:via-gray-800/50 dark:to-purple-900/10" />
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                >
                  <FunnelIcon className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Smart Filters
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find exactly what you're looking for
                  </p>
                </div>
              </div>
              
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilters({ search: '', status: '', severity: '', page: 1, limit: 10 })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl transition-all duration-200 font-medium"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Clear All ({activeFiltersCount})
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Enhanced Search */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  {filters.search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleFilterChange('search', '')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Enhanced Status Filter */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">🔴 Active</option>
                    <option value="improving">🟡 Improving</option>
                    <option value="resolved">🟢 Resolved</option>
                    <option value="worsening">🔴 Worsening</option>
                  </select>
                  <ChartBarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Enhanced Severity Filter */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative">
                  <select
                    value={filters.severity}
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">All Severities</option>
                    <option value="1">😌 Mild (1-3)</option>
                    <option value="4">😐 Moderate (4-6)</option>
                    <option value="7">😰 Severe (7-10)</option>
                  </select>
                  <FireIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Quick Action Button */}
              <motion.div 
                className="flex gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  to="/symptoms/new"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </motion.div>
            </div>
            
            {/* Active Filters Display */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Active filters:</span>
                    {filters.search && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                      >
                        Search: "{filters.search}"
                        <button
                          onClick={() => handleFilterChange('search', '')}
                          className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </motion.span>
                    )}
                    {filters.status && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full"
                      >
                        Status: {filters.status}
                        <button
                          onClick={() => handleFilterChange('status', '')}
                          className="ml-1 hover:bg-green-200 dark:hover:bg-green-800/50 rounded-full p-0.5"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </motion.span>
                    )}
                    {filters.severity && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full"
                      >
                        Severity: {filters.severity}+
                        <button
                          onClick={() => handleFilterChange('severity', '')}
                          className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800/50 rounded-full p-0.5"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Symptoms List */}
        <motion.div 
          className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-white/30 to-pink-50/30 dark:from-red-900/5 dark:via-gray-800/30 dark:to-pink-900/5" />
          
          <div className="relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl"
                  >
                    <HeartIconSolid className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Your Symptoms
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {symptoms.length > 0 ? `${symptoms.length} symptoms found` : 'No symptoms to display'}
                    </p>
                  </div>
                </div>
                
                {symptoms.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Showing {((pagination.current - 1) * pagination.limit) + 1}-{Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-2">
              {symptoms.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                    className="mx-auto h-24 w-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-6"
                  >
                    <HeartIcon className="h-12 w-12 text-red-400 dark:text-red-500" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {filters.search || filters.status || filters.severity
                      ? 'No matching symptoms found'
                      : 'Ready to start your health journey?'
                    }
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {filters.search || filters.status || filters.severity
                      ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                      : 'Begin tracking your symptoms to get personalized health insights and recommendations from our AI-powered system.'
                    }
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/symptoms/new"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <PlusIcon className="mr-3 h-5 w-5" />
                        {filters.search || filters.status || filters.severity ? 'Log New Symptom' : 'Start Your Health Journey'}
                      </Link>
                    </motion.div>
                    
                    {(filters.search || filters.status || filters.severity) && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={() => setFilters({ search: '', status: '', severity: '', page: 1, limit: 10 })}
                          className="inline-flex items-center px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300"
                        >
                          <XMarkIcon className="mr-2 h-5 w-5" />
                          Clear All Filters
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-2"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.05 } }
                  }}
                >
                  {symptoms.map((symptom, index) => (
                    <motion.div
                      key={symptom._id}
                      variants={{
                        hidden: { opacity: 0, x: -20, scale: 0.95 },
                        show: { opacity: 1, x: 0, scale: 1 }
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <Link
                        to={`/symptoms/${symptom._id}`}
                        className="block p-4 m-2 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 hover:from-slate-200 hover:via-gray-100 hover:to-blue-200/50 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-blue-800/30 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-700/50 transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Enhanced Severity Indicator */}
                            <motion.div 
                              className={`relative p-3 rounded-xl ${getSeverityColorClass(symptom.severity)} shadow-md group-hover:shadow-lg transition-shadow duration-300`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <HeartIconSolid className="h-5 w-5 relative z-10" />
                              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>

                            {/* Enhanced Symptom Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                                  {symptom.name}
                                </h3>
                                <motion.span 
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColorClass(symptom.status)}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {formatStatus(symptom.status)}
                                </motion.span>
                              </div>

                              {/* Enhanced Meta Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Severity:</span>
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-gray-900 dark:text-white">{symptom.severity}/10</span>
                                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded-full">
                                        {formatSeverity(symptom.severity)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{formatDuration(symptom.duration)}</span>
                                </div>
                                
                                {symptom.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">{symptom.location}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              {symptom.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                                  {symptom.description}
                                </p>
                              )}

                              {/* Enhanced Associated Symptoms */}
                              {symptom.associatedSymptoms && symptom.associatedSymptoms.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {symptom.associatedSymptoms.slice(0, 3).map((s, i) => (
                                    <motion.span
                                      key={i}
                                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200/50 dark:border-blue-700/50"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {s.name}
                                    </motion.span>
                                  ))}
                                  {symptom.associatedSymptoms.length > 3 && (
                                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                                      +{symptom.associatedSymptoms.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Enhanced Date Section */}
                          <div className="text-right ml-6 min-w-0">
                            <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                              {formatDate(symptom.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {formatDate(symptom.createdAt, 'h:mm a')}
                            </div>
                            <motion.div 
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                              whileHover={{ scale: 1.05 }}
                            >
                              <CalendarDaysIcon className="h-3 w-3" />
                              <span>View</span>
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Pagination */}
        {pagination.pages > 1 && (
          <motion.div 
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 dark:border-gray-700/50"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-900/10 dark:via-gray-800/50 dark:to-gray-900/10" />
            
            <div className="relative px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results Info */}
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Showing <span className="font-bold text-blue-600 dark:text-blue-400">{((pagination.current - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(pagination.current * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{pagination.total}</span> results
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600" />
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Page {pagination.current} of {pagination.pages}</span>
                  </div>
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    whileHover={{ scale: pagination.current === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: pagination.current === 1 ? 1 : 0.95 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pagination.current === 1
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </motion.button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1
                      const isActive = page === pagination.current
                      return (
                        <motion.button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          {page}
                        </motion.button>
                      )
                    })}
                  </div>

                  <motion.button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    whileHover={{ scale: pagination.current === pagination.pages ? 1 : 1.05 }}
                    whileTap={{ scale: pagination.current === pagination.pages ? 1 : 0.95 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pagination.current === pagination.pages
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Symptoms