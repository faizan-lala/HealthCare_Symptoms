import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  FireIcon,
  SparklesIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'
import {
  formatDate,
  formatDuration,
  formatSeverity,
  getSeverityColorClass,
  getStatusColorClass,
  formatStatus,
  formatTemperature,
  formatBloodPressure,
  formatList
} from '../utils/formatters'

const SymptomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch symptom details
  const { data, isLoading, error } = useQuery(
    ['symptom', id],
    () => api.get(`/symptoms/${id}`),
    { enabled: !!id }
  )

  // Fetch suggestions for this symptom
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery(
    ['symptom-suggestions', id],
    () => api.get(`/suggestions/symptom/${id}`),
    { enabled: !!id }
  )

  const symptom = data?.data?.data?.symptom
  const suggestions = suggestionsData?.data?.data?.suggestions || []

  // Delete mutation
  const deleteMutation = useMutation(
    () => api.delete(`/symptoms/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('symptoms')
        queryClient.invalidateQueries('symptom-stats')
        toast.success('Symptom deleted successfully')
        navigate('/symptoms')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete symptom')
      }
    }
  )

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !symptom) {
    return (
      <div className="text-center py-12">
        <div className="text-danger-600 dark:text-danger-400 mb-4">
          <HeartIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Symptom not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The symptom you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/symptoms" className="btn btn-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Symptoms
        </Link>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/symptoms')}
                className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {symptom.name}
                </motion.h1>
                <motion.p 
                  className="mt-2 text-gray-600 dark:text-gray-400 flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ClockIcon className="h-4 w-4" />
                  Logged on {formatDate(symptom.createdAt, 'MMMM d, yyyy \'at\' h:mm a')}
                </motion.p>
              </div>
            </div>

            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={`/symptoms/${id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              </motion.div>
              <motion.button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Add margin between header and content */}
        <div className="mt-8">
          {/* Main Info Card */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-6 left-6 text-5xl">❤️</div>
              <div className="absolute top-12 right-12 text-4xl">🩺</div>
              <div className="absolute bottom-6 left-12 text-3xl">📊</div>
              <div className="absolute bottom-12 right-6 text-4xl">💊</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-8 left-8 w-20 h-20 bg-purple-400/10 rounded-full blur-xl animate-float" />
            
            <div className="relative p-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Primary Details */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Severity and Status */}
                  <motion.div 
                    className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="flex items-center gap-5">
                        <motion.div 
                          className={`p-5 rounded-3xl shadow-xl ${getSeverityColorClass(symptom.severity)}`}
                          whileHover={{ scale: 1.08, rotate: 8 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <HeartSolid className="h-10 w-10" />
                        </motion.div>
                        <div>
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-wide">Severity Level</div>
                          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {symptom.severity}/10
                          </div>
                          <div className={`text-base font-semibold ${
                            symptom.severity <= 3 ? 'text-green-600 dark:text-green-400' :
                            symptom.severity <= 6 ? 'text-yellow-600 dark:text-yellow-400' :
                            symptom.severity <= 8 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatSeverity(symptom.severity)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold shadow-lg ${getStatusColorClass(symptom.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          {formatStatus(symptom.status)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description */}
                  {symptom.description && (
                    <motion.div 
                      className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        Description
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {symptom.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Associated Symptoms */}
                  {symptom.associatedSymptoms && symptom.associatedSymptoms.length > 0 && (
                    <motion.div 
                      className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <HeartIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        Associated Symptoms
                      </h3>
                      <div className="space-y-3">
                        {symptom.associatedSymptoms.map((assocSymptom, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-600/60 rounded-xl border border-gray-200/50 dark:border-gray-500/50">
                            <span className="text-gray-900 dark:text-white font-semibold text-base">
                              {assocSymptom.name}
                            </span>
                            {assocSymptom.severity && (
                              <span className={`px-3 py-1 rounded-xl text-sm font-bold shadow-md ${getSeverityColorClass(assocSymptom.severity)}`}>
                                {assocSymptom.severity}/10
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Triggers */}
                  {symptom.triggers && symptom.triggers.length > 0 && (
                    <motion.div 
                      className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        Possible Triggers
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {symptom.triggers.map((trigger, index) => (
                          <motion.span
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-700/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {trigger}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Notes */}
                  {symptom.notes && (
                    <motion.div 
                      className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <DocumentTextIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        Additional Notes
                      </h3>
                      <div className="p-4 bg-white/60 dark:bg-gray-600/60 rounded-xl border border-gray-200/50 dark:border-gray-500/50">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                          {symptom.notes}
                        </p>
                      </div>
                    </motion.div>
                  )}
            </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  {/* Quick Facts */}
                  <motion.div 
                    className="bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-700/90 dark:to-blue-900/30 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      Quick Facts
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-600/60 rounded-xl">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Duration</div>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {formatDuration(symptom.duration)}
                          </div>
                        </div>
                      </div>

                      {symptom.location && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-600/60 rounded-xl">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Location</div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {symptom.location}
                            </div>
                          </div>
                        </div>
                      )}

                      {symptom.temperature && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-600/60 rounded-xl">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <FireIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Temperature</div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {formatTemperature(symptom.temperature)}
                            </div>
                          </div>
                        </div>
                      )}

                      {symptom.bloodPressure && (symptom.bloodPressure.systolic || symptom.bloodPressure.diastolic) && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-600/60 rounded-xl">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <HeartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Blood Pressure</div>
                            <div className="text-gray-900 dark:text-white font-medium">
                              {formatBloodPressure(symptom.bloodPressure)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Tags */}
                  {symptom.tags && symptom.tags.length > 0 && (
                    <motion.div 
                      className="bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-700/90 dark:to-purple-900/30 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <TagIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {symptom.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Medications */}
                  {symptom.medications && symptom.medications.length > 0 && (
                    <motion.div 
                      className="bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-700/90 dark:to-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <HeartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        Current Medications
                      </h3>
                      <div className="space-y-3">
                        {symptom.medications.map((med, index) => (
                          <div key={index} className="p-4 bg-white/60 dark:bg-gray-600/60 rounded-xl border border-gray-200/50 dark:border-gray-500/50">
                            <div className="font-semibold text-gray-900 dark:text-white text-base">
                              {med.name}
                            </div>
                            {(med.dosage || med.frequency) && (
                              <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                {med.dosage} {med.frequency && `• ${med.frequency}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-6 left-6 text-5xl">🧠</div>
                <div className="absolute top-12 right-12 text-4xl">💡</div>
                <div className="absolute bottom-6 left-12 text-3xl">✨</div>
                <div className="absolute bottom-12 right-6 text-4xl">🎯</div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-8 right-8 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-indigo-400/10 rounded-full blur-xl animate-float" />
              
              <div className="relative p-8">
                <motion.div 
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl">
                    <LightBulbIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Health Insights for this Symptom
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      AI-powered recommendations based on your symptom data
                    </p>
                  </div>
                </motion.div>
              
              {suggestionsLoading ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <div className="space-y-6">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className={`p-8 rounded-3xl border-2 shadow-xl backdrop-blur-sm ${
                        suggestion.urgency === 'emergency'
                          ? 'border-red-300/50 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:border-red-700/50 dark:from-red-900/20 dark:to-red-800/10'
                          : suggestion.urgency === 'urgent'
                          ? 'border-orange-300/50 bg-gradient-to-br from-orange-50/80 to-orange-100/60 dark:border-orange-700/50 dark:from-orange-900/20 dark:to-orange-800/10'
                          : suggestion.urgency === 'moderate'
                          ? 'border-yellow-300/50 bg-gradient-to-br from-yellow-50/80 to-yellow-100/60 dark:border-yellow-700/50 dark:from-yellow-900/20 dark:to-yellow-800/10'
                          : 'border-blue-300/50 bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:border-blue-700/50 dark:from-blue-900/20 dark:to-blue-800/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl shadow-lg ${
                            suggestion.urgency === 'emergency' ? 'bg-red-500' :
                            suggestion.urgency === 'urgent' ? 'bg-orange-500' :
                            suggestion.urgency === 'moderate' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-xl">
                            {suggestion.action}
                          </h4>
                        </div>
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                          suggestion.confidence >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          suggestion.confidence >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {suggestion.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-base">
                        {suggestion.reasoning}
                      </p>
                      {suggestion.nextSteps && suggestion.nextSteps.length > 0 && (
                        <div className="bg-white/60 dark:bg-gray-600/60 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-500/50">
                          <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            Recommended Actions:
                          </h5>
                          <ul className="space-y-3">
                            {suggestion.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md">
                                  {stepIndex + 1}
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Symptom
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this symptom? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="btn btn-danger"
              >
                {deleteMutation.isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SymptomDetail
