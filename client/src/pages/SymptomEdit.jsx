import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  ArrowLeftIcon,
  CheckIcon,
  HeartIcon,
  DocumentTextIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const SEVERITY_LABELS = {
  1: 'Very Mild',
  2: 'Mild',
  3: 'Mild-Moderate',
  4: 'Moderate',
  5: 'Moderate',
  6: 'Moderate-Severe',
  7: 'Severe',
  8: 'Very Severe',
  9: 'Extremely Severe',
  10: 'Unbearable'
}

const SymptomEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['symptom', id], () => api.get(`/symptoms/${id}`), { enabled: !!id })
  const symptom = data?.data?.data?.symptom

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const selectedSeverity = watch('severity', 5)

  useEffect(() => {
    if (symptom) {
      reset({
        name: symptom.name,
        description: symptom.description || '',
        severity: symptom.severity,
        status: symptom.status || 'active',
      })
    }
  }, [symptom, reset])

  const updateMutation = useMutation((payload) => api.put(`/symptoms/${id}`, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries('symptoms')
      queryClient.invalidateQueries(['symptom', id])
      queryClient.invalidateQueries('symptom-stats')
      toast.success('Symptom updated successfully!')
      navigate(`/symptoms/${id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update symptom')
    }
  })

  const onSubmit = (values) => {
    updateMutation.mutate(values)
  }

  if (isLoading || !symptom) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
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
        className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 mx-4 sm:mx-6 lg:mx-8"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <motion.button
              onClick={() => navigate(`/symptoms/${id}`)}
              className="self-start p-2.5 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            
            <div className="flex-1 min-w-0">
              <motion.h1 
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Edit Symptom
              </motion.h1>
              <motion.p 
                className="mt-2 text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Update your symptom details and tracking information
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3 self-start sm:self-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                <HeartSolid className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate max-w-[150px] sm:max-w-none">
                  Editing: {symptom?.name}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Add proper margin between header and content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Enhanced Edit Form */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/40 dark:from-gray-800/95 dark:to-green-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
              <div className="absolute top-6 left-6 text-5xl">✏️</div>
              <div className="absolute top-12 right-12 text-4xl">💊</div>
              <div className="absolute bottom-6 left-12 text-3xl">📊</div>
              <div className="absolute bottom-12 right-6 text-2xl">🏥</div>
            </div>
            
            <div className="relative p-6 sm:p-8">
              <motion.div 
                className="flex items-start gap-4 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-3.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg ring-4 ring-green-100/50 dark:ring-green-900/30">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Symptom Details
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Update the information about your symptom
                  </p>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Name */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    Symptom Name *
                  </label>
                  <div className="relative group">
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${
                        errors.name 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                      } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4`}
                      placeholder="Enter symptom name"
                    />
                    {!errors.name && (
                      <motion.div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                  {errors.name && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-red-500">⚠</span>
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                    Description
                  </label>
                  <div className="relative group">
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-4"
                      placeholder="Describe your symptom in detail..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                      Optional
                    </div>
                  </div>
                </motion.div>

                {/* Severity */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FireIcon className="h-4 w-4 text-orange-500" />
                    Severity Level
                  </label>
                  <div className="p-6 sm:p-8 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 dark:from-green-900/20 dark:via-yellow-900/20 dark:to-red-900/20 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Rate your symptom severity from 1 (Very Mild) to 10 (Unbearable)
                        </p>
                      </div>
                      
                      <div className="relative">
                        <input
                          {...register('severity', { 
                            valueAsNumber: true,
                            min: { value: 1, message: 'Severity must be at least 1' },
                            max: { value: 10, message: 'Severity cannot exceed 10' }
                          })}
                          type="range"
                          min="1"
                          max="10"
                          className="w-full h-4 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 dark:from-green-800 dark:via-yellow-800 dark:to-red-800 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                        />
                        <div className="flex justify-between items-center text-xs mt-2">
                          <span className="text-green-600 dark:text-green-400 font-medium">Very Mild</span>
                          <span className="text-red-600 dark:text-red-400 font-medium">Unbearable</span>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="flex justify-center"
                        key={selectedSeverity}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg backdrop-blur-sm">
                          <div className={`w-4 h-4 rounded-full shadow-sm ${
                            selectedSeverity <= 3 ? 'bg-green-500' :
                            selectedSeverity <= 6 ? 'bg-yellow-500' :
                            selectedSeverity <= 8 ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                          <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {selectedSeverity}/10
                          </span>
                          <span className={`text-sm font-semibold ${
                            selectedSeverity <= 3 ? 'text-green-600 dark:text-green-400' :
                            selectedSeverity <= 6 ? 'text-yellow-600 dark:text-yellow-400' :
                            selectedSeverity <= 8 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {SEVERITY_LABELS[selectedSeverity]}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  {errors.severity && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-red-500">⚠</span>
                      {errors.severity.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Status */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                    Current Status
                  </label>
                  <div className="relative group">
                    <select 
                      {...register('status')} 
                      className="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md text-gray-900 dark:text-white focus:outline-none focus:ring-4 appearance-none cursor-pointer"
                    >
                      <option value="active">🟢 Active</option>
                      <option value="improving">📈 Improving</option>
                      <option value="resolved">✅ Resolved</option>
                      <option value="worsening">📉 Worsening</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Form Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-8"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              onClick={() => navigate(`/symptoms/${id}`)}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={updateMutation.isLoading}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {updateMutation.isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="animate-pulse">Saving Changes...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
      </form>
    </div>
    </motion.div>
  )
}

export default SymptomEdit


