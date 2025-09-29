import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import {
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { 
  LightBulbIcon as LightBulbIconSolid,
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, getUrgencyColorClass } from '../utils/formatters'

const Suggestions = () => {
  const [analysisType, setAnalysisType] = useState('recent') // recent, all, custom

  // Fetch health recommendations
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery(
    'health-recommendations',
    () => api.get('/suggestions/recommendations'),
    { staleTime: 10 * 60 * 1000 }
  )

  // Analyze symptoms mutation
  const analyzeSymptomsMutation = useMutation(
    (params) => api.post('/suggestions/analyze', params),
    {
      onError: (error) => {
        console.error('Analysis error:', error)
      }
    }
  )

  const recommendations = recommendationsData?.data?.data?.recommendations || []
  const analysis = analyzeSymptomsMutation.data?.data?.data
  const isAnalyzing = analyzeSymptomsMutation.isLoading

  const handleAnalyze = () => {
    const params = analysisType === 'all' 
      ? { includeAll: true }
      : { includeAll: false }
    
    analyzeSymptomsMutation.mutate(params)
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return ExclamationTriangleIcon
      case 'urgent':
        return ExclamationTriangleIcon
      case 'moderate':
        return ClockIcon
      case 'mild':
        return CheckCircleIcon
      default:
        return LightBulbIcon
    }
  }

  const getUrgencyBadge = (urgency) => {
    const colors = {
      emergency: 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300',
      urgent: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      moderate: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
      mild: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
      routine: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300'
    }
    
    return colors[urgency] || colors.routine
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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
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
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl" />
            
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
              className="absolute bottom-8 left-12 w-12 h-12 bg-purple-400/20 rounded-full blur-xl"
              animate={{ 
                y: [8, -12, 8], 
                x: [4, -6, 4],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            {/* AI & Health Icons */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-2xl">🧠</div>
              <div className="absolute top-8 right-16 text-xl">💡</div>
              <div className="absolute bottom-8 left-16 text-lg">📊</div>
              <div className="absolute bottom-4 right-8 text-xl">🤖</div>
              <div className="absolute top-1/2 left-1/4 text-sm">✨</div>
              <div className="absolute top-1/3 right-1/3 text-sm">🎯</div>
            </div>
          </div>
          
          <div className="relative px-6 sm:px-8 py-8 text-gray-900 dark:text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span className="text-2xl">🧠</span>
                    </motion.div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Health Insights & AI Suggestions
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                        AI-powered insights for your health journey
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Quick Stats */}
                <motion.div 
                  className="flex flex-wrap gap-4 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <SparklesIcon className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">
                      AI-Powered Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <ShieldCheckIcon className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-medium">
                      Personalized Recommendations
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <TrophyIcon className="h-5 w-5 text-orange-300" />
                    <span className="text-sm font-medium">
                      Health Optimization
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 group"
                  >
                    {isAnalyzing ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          className="mr-2"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </motion.div>
                        <span className="text-sm font-medium">Analyze My Health</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Symptom Analysis Section */}
        <motion.div 
          className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-white/30 to-indigo-50/30 dark:from-purple-900/5 dark:via-gray-800/30 dark:to-indigo-900/5" />
          
          <div className="relative">
            {/* Enhanced Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl"
                  >
                    <ChartBarIcon className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      AI Symptom Analysis
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Advanced pattern recognition and health insights
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
                  whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isAnalyzing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" color="gray" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </motion.div>
                      <span>Run Analysis</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Enhanced Analysis Type Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <SparklesIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Analysis Scope
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.label 
                    className={`relative cursor-pointer group ${analysisType === 'recent' ? 'scale-105' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value="recent"
                      checked={analysisType === 'recent'}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      analysisType === 'recent'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ClockIcon className={`h-5 w-5 ${analysisType === 'recent' ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${analysisType === 'recent' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-gray-300'}`}>
                            Recent Analysis
                          </span>
                        </div>
                        {analysisType === 'recent' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <p className={`text-sm ${analysisType === 'recent' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        Analyze symptoms from the last 24 hours for immediate insights and quick recommendations.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                          Quick Analysis
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                          24 Hours
                        </span>
                      </div>
                    </div>
                  </motion.label>

                  <motion.label 
                    className={`relative cursor-pointer group ${analysisType === 'all' ? 'scale-105' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value="all"
                      checked={analysisType === 'all'}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      analysisType === 'all'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className={`h-5 w-5 ${analysisType === 'all' ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold ${analysisType === 'all' ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-gray-300'}`}>
                            Comprehensive Analysis
                          </span>
                        </div>
                        {analysisType === 'all' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <p className={`text-sm ${analysisType === 'all' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        Deep analysis of all active symptoms over 7 days for comprehensive health patterns and trends.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium">
                          Deep Analysis
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                          7 Days
                        </span>
                      </div>
                    </div>
                  </motion.label>
                </div>
              </div>

              {/* Enhanced Analysis Results */}
              <AnimatePresence>
                {analysis ? (
                  <motion.div 
                    className="space-y-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Enhanced Summary */}
                    <motion.div 
                      className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
                      
                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 10, scale: 1.05 }}
                              className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl"
                            >
                              <ChartBarIcon className="h-6 w-6 text-white" />
                            </motion.div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                Analysis Summary
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Generated on {formatDate(analysis.analysisDate)}
                              </p>
                            </div>
                          </div>
                          
                          <motion.div
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl"
                            whileHover={{ scale: 1.05 }}
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold">Analysis Complete</span>
                          </motion.div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <motion.div 
                            className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-blue-200/30 dark:border-blue-700/20"
                            whileHover={{ y: -2 }}
                          >
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {analysis.analyzedSymptoms?.length || 0}
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms Analyzed</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Data Points</div>
                          </motion.div>
                          
                          <motion.div 
                            className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200/30 dark:border-green-700/20"
                            whileHover={{ y: -2 }}
                          >
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                              {analysis.confidence}%
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Level</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {analysis.confidence >= 80 ? 'High Accuracy' : analysis.confidence >= 60 ? 'Good Accuracy' : 'Moderate Accuracy'}
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-purple-200/30 dark:border-purple-700/20"
                            whileHover={{ y: -2 }}
                          >
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                              {analysis.suggestions?.length || 0}
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Recommendations</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Personalized</div>
                          </motion.div>
                        </div>
                        
                        {analysis.reasoning && (
                          <motion.div 
                            className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/30 dark:border-gray-700/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <InformationCircleIcon className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Reasoning</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {analysis.reasoning}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Enhanced Analyzed Symptoms */}
                    {analysis.analyzedSymptoms && analysis.analyzedSymptoms.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <HeartIconSolid className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Analyzed Symptoms
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysis.analyzedSymptoms.map((symptom, index) => (
                            <motion.div 
                              key={symptom.id} 
                              className="group relative p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 hover:shadow-lg"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              whileHover={{ scale: 1.02, y: -2 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                                    <HeartIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                                      {symptom.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">Severity:</span>
                                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{symptom.severity}/10</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        symptom.severity <= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        symptom.severity <= 6 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                      }`}>
                                        {symptom.severity <= 3 ? 'Mild' : symptom.severity <= 6 ? 'Moderate' : 'Severe'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(symptom.createdAt)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Analyzed
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

              {/* Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    AI Recommendations
                  </h4>
                  <div className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => {
                      const UrgencyIcon = getUrgencyIcon(suggestion.urgency)
                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-6 ${getUrgencyColorClass(suggestion.urgency)}`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <UrgencyIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-lg font-medium">
                                  {suggestion.action}
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadge(suggestion.urgency)}`}>
                                    {suggestion.urgency}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {suggestion.confidence}% confidence
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm mb-4 opacity-90">
                                {suggestion.reasoning}
                              </p>

                              {suggestion.nextSteps && suggestion.nextSteps.length > 0 && (
                                <div>
                                  <h6 className="text-sm font-medium mb-2">
                                    Recommended Actions:
                                  </h6>
                                  <ul className="text-sm space-y-1">
                                    {suggestion.nextSteps.map((step, stepIndex) => (
                                      <li key={stepIndex} className="flex items-start">
                                        <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0"></span>
                                        <span className="opacity-90">{step}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

                    {/* Disclaimer */}
                    <motion.div 
                      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Disclaimer:</strong> {analysis.disclaimer}
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                        className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6"
                      >
                        <LightBulbIconSolid className="h-12 w-12 text-purple-500 dark:text-purple-400" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready for AI Analysis?
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                        Click "Run Analysis" above to get AI-powered insights based on your logged symptoms and receive personalized health recommendations.
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            <SparklesIcon className="h-5 w-5" />
                          )}
                          <span>{isAnalyzing ? 'Analyzing...' : 'Start Analysis'}</span>
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        {/* Enhanced General Health Recommendations */}
        <motion.div 
          className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-white/30 to-blue-50/30 dark:from-green-900/5 dark:via-gray-800/30 dark:to-blue-900/5" />
          
          <div className="relative">
            {/* Enhanced Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl"
                >
                  <ShieldCheckIcon className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    General Health Recommendations
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Evidence-based wellness guidance for optimal health
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {recommendationsLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mx-auto h-12 w-12 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">Loading recommendations...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group relative p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            recommendation.priority === 'high'
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : recommendation.priority === 'medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30'
                              : 'bg-green-100 dark:bg-green-900/30'
                          }`}>
                            {recommendation.priority === 'high' ? (
                              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : recommendation.priority === 'medium' ? (
                              <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            {recommendation.title}
                          </h4>
                        </div>
                        
                        <motion.span 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            recommendation.priority === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : recommendation.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {recommendation.priority.toUpperCase()} PRIORITY
                        </motion.span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {recommendation.description}
                      </p>

                      {recommendation.actions && recommendation.actions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <StarIconSolid className="h-4 w-4 text-yellow-500" />
                            <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                              Recommended Actions:
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recommendation.actions.map((action, actionIndex) => (
                              <motion.div
                                key={actionIndex}
                                className="flex items-start gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                    className="mx-auto h-24 w-24 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mb-6"
                  >
                    <ShieldCheckIcon className="h-12 w-12 text-green-500 dark:text-green-400" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No Recommendations Available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    Start logging symptoms to receive personalized health recommendations tailored to your specific needs.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Health Tips */}
        <motion.div 
          className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-white/30 to-yellow-50/30 dark:from-orange-900/5 dark:via-gray-800/30 dark:to-yellow-900/5" />
          
          <div className="relative">
            {/* Enhanced Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-900/10 dark:to-yellow-900/10">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 10 }}
                  className="p-2 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl"
                >
                  <TrophyIcon className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    General Health Tips
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expert wellness advice for optimal health
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Wellness */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                      <HeartIconSolid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      Daily Wellness
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: '💧', text: 'Stay hydrated (8 glasses of water daily)', color: 'blue' },
                      { icon: '😴', text: 'Get 7-9 hours of quality sleep', color: 'purple' },
                      { icon: '🏃‍♂️', text: 'Exercise regularly (30 minutes, 5 days/week)', color: 'green' },
                      { icon: '🧘‍♀️', text: 'Practice stress management techniques', color: 'pink' },
                      { icon: '🥗', text: 'Maintain a balanced diet', color: 'orange' }
                    ].map((tip, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center gap-3 p-3 bg-gradient-to-r from-white to-${tip.color}-50 dark:from-gray-700 dark:to-${tip.color}-900/20 rounded-xl border border-${tip.color}-200/30 dark:border-${tip.color}-700/20 hover:shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 0.2 }}
                      >
                        <span className="text-xl">{tip.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tip.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Symptom Tracking */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                      <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      Symptom Tracking
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: '⚡', text: 'Log symptoms as soon as they occur', color: 'red' },
                      { icon: '📝', text: 'Be detailed and specific', color: 'blue' },
                      { icon: '🔍', text: 'Note potential triggers', color: 'yellow' },
                      { icon: '💊', text: 'Track medication effects', color: 'green' },
                      { icon: '📊', text: 'Monitor patterns over time', color: 'purple' }
                    ].map((tip, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center gap-3 p-3 bg-gradient-to-r from-white to-${tip.color}-50 dark:from-gray-700 dark:to-${tip.color}-900/20 rounded-xl border border-${tip.color}-200/30 dark:border-${tip.color}-700/20 hover:shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 0.3 }}
                      >
                        <span className="text-xl">{tip.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tip.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Call to Action */}
              <motion.div 
                className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <StarIconSolid className="h-5 w-5 text-yellow-500" />
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                    Ready to optimize your health?
                  </h5>
                  <StarIconSolid className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Start implementing these evidence-based recommendations today for better health outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnalyze}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    <span>Get Personalized Insights</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Suggestions
