import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  PlusIcon,
  XMarkIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  ArrowLeftIcon,
  SparklesIcon,
  FireIcon,
  BeakerIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'

// Add custom CSS for animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

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

const DURATION_UNITS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'improving', label: 'Improving' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'worsening', label: 'Worsening' }
]

const AddSymptom = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedSeverity, setSelectedSeverity] = useState(5)

  // Fetch common symptoms for quick selection
  const { data: commonSymptomsData } = useQuery(
    'common-symptoms',
    () => api.get('/symptoms/common'),
    { staleTime: 10 * 60 * 1000 }
  )

  const commonSymptoms = commonSymptomsData?.data?.data?.commonSymptoms || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      severity: 5,
      duration: { value: 1, unit: 'hours' },
      location: '',
      triggers: [],
      associatedSymptoms: [],
      temperature: '',
      bloodPressure: { systolic: '', diastolic: '' },
      medications: [],
      tags: [],
      status: 'active',
      notes: ''
    }
  })

  const {
    fields: triggerFields,
    append: appendTrigger,
    remove: removeTrigger
  } = useFieldArray({
    control,
    name: 'triggers'
  })

  const {
    fields: associatedSymptomFields,
    append: appendAssociatedSymptom,
    remove: removeAssociatedSymptom
  } = useFieldArray({
    control,
    name: 'associatedSymptoms'
  })

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication
  } = useFieldArray({
    control,
    name: 'medications'
  })

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag
  } = useFieldArray({
    control,
    name: 'tags'
  })

  const createSymptomMutation = useMutation(
    (data) => api.post('/symptoms', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('symptoms')
        queryClient.invalidateQueries('symptom-stats')
        toast.success('Symptom logged successfully!')
        navigate('/symptoms')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to log symptom')
      }
    }
  )

  const onSubmit = (data) => {
    // Clean up data
    const cleanData = {
      ...data,
      triggers: data.triggers.filter(t => t.trim()),
      tags: data.tags.filter(t => t.trim()),
      associatedSymptoms: data.associatedSymptoms.filter(s => s.name && s.name.trim()),
      medications: data.medications.filter(m => m.name && m.name.trim()),
      temperature: data.temperature ? parseFloat(data.temperature) : undefined,
      bloodPressure: (data.bloodPressure.systolic || data.bloodPressure.diastolic) ? {
        systolic: data.bloodPressure.systolic ? parseInt(data.bloodPressure.systolic) : undefined,
        diastolic: data.bloodPressure.diastolic ? parseInt(data.bloodPressure.diastolic) : undefined
      } : undefined
    }

    createSymptomMutation.mutate(cleanData)
  }

  const handleQuickSymptomSelect = (symptomName) => {
    setValue('name', symptomName)
    // Auto-fill severity based on user's history
    const userSymptom = commonSymptoms.find(s => s.name === symptomName && s.source === 'user')
    if (userSymptom && userSymptom.avgSeverity > 0) {
      const roundedSeverity = Math.round(userSymptom.avgSeverity)
      setValue('severity', roundedSeverity)
      setSelectedSeverity(roundedSeverity)
    }
  }

  const addArrayField = (fieldName, defaultValue) => {
    if (fieldName === 'triggers') appendTrigger('')
    else if (fieldName === 'associatedSymptoms') appendAssociatedSymptom({ name: '', severity: 5 })
    else if (fieldName === 'medications') appendMedication({ name: '', dosage: '', frequency: '' })
    else if (fieldName === 'tags') appendTag('')
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
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Log New Symptom
              </motion.h1>
              <motion.p 
                className="mt-2 sm:mt-3 text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Record details about your symptoms to track your health and get personalized insights.
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <HeartSolid className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Health Tracking</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Quick Symptom Selection */}
          {commonSymptoms.length > 0 && (
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 mt-8 sm:mt-12"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg animate-float" />
              
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 text-4xl">💊</div>
                <div className="absolute top-8 right-8 text-3xl">🏥</div>
                <div className="absolute bottom-8 left-8 text-2xl">🔬</div>
                <div className="absolute bottom-4 right-4 text-3xl">📊</div>
              </div>
              
              <div className="relative p-4 sm:p-6">
                <motion.div 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Quick Selection
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Choose from commonly logged symptoms
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      <SparklesIcon className="h-3 w-3" />
                      Popular
                    </span>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {commonSymptoms.slice(0, 12).map((symptom, index) => (
                    <motion.button
                      key={symptom.name}
                      type="button"
                      onClick={() => handleQuickSymptomSelect(symptom.name)}
                      className="group relative p-3 sm:p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate pr-2">
                          {symptom.name}
                        </div>
                        {symptom.source === 'user' && symptom.frequency > 0 && (
                          <motion.div 
                            className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      {symptom.source === 'user' && symptom.frequency > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          Used {symptom.frequency} time{symptom.frequency !== 1 ? 's' : ''}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Basic Information */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 text-4xl">💊</div>
              <div className="absolute top-8 right-8 text-3xl">🏥</div>
              <div className="absolute bottom-4 left-8 text-2xl">🔬</div>
              <div className="absolute bottom-8 right-4 text-3xl">📊</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-green-400/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl animate-float" />
            
            <div className="relative p-6">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Essential details about your symptom
                  </p>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Symptom Name */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    Symptom Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('name', { required: 'Symptom name is required' })}
                      type="text"
                      className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                        errors.name 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="e.g., Headache, Chest pain, Nausea"
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
                      <XMarkIcon className="h-4 w-4" />
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
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Describe your symptom in detail... When did it start? How does it feel? What makes it better or worse?"
                  />
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
                    Severity * (1 = Very Mild, 10 = Unbearable)
                  </label>
                  <div className="p-6 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 dark:from-green-900/20 dark:via-yellow-900/20 dark:to-red-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="space-y-4">
                      <input
                        {...register('severity', { 
                          required: 'Severity is required',
                          min: { value: 1, message: 'Severity must be at least 1' },
                          max: { value: 10, message: 'Severity cannot exceed 10' }
                        })}
                        type="range"
                        min="1"
                        max="10"
                        className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 dark:from-green-800 dark:via-yellow-800 dark:to-red-800 rounded-lg appearance-none cursor-pointer slider"
                        onChange={(e) => setSelectedSeverity(parseInt(e.target.value))}
                      />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">Very Mild</span>
                        <motion.div 
                          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                          key={selectedSeverity}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <div className={`w-3 h-3 rounded-full ${
                            selectedSeverity <= 3 ? 'bg-green-500' :
                            selectedSeverity <= 6 ? 'bg-yellow-500' :
                            selectedSeverity <= 8 ? 'bg-orange-500' : 'bg-red-500'
                          }`} />
                          <span className="font-bold text-gray-900 dark:text-white">
                            {selectedSeverity}/10
                          </span>
                          <span className={`text-sm font-medium ${
                            selectedSeverity <= 3 ? 'text-green-600 dark:text-green-400' :
                            selectedSeverity <= 6 ? 'text-yellow-600 dark:text-yellow-400' :
                            selectedSeverity <= 8 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {SEVERITY_LABELS[selectedSeverity]}
                          </span>
                        </motion.div>
                        <span className="text-red-600 dark:text-red-400 font-medium">Unbearable</span>
                      </div>
                    </div>
                  </div>
                  {errors.severity && (
                    <motion.p 
                      className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <XMarkIcon className="h-4 w-4" />
                      {errors.severity.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Duration & Location */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-purple-500" />
                    Duration *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        {...register('duration.value', { 
                          required: 'Duration value is required',
                          min: { value: 0, message: 'Duration cannot be negative' }
                        })}
                        type="number"
                        min="0"
                        step="0.5"
                        className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                          errors.duration?.value 
                            ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                        } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                        placeholder="e.g., 2"
                      />
                      {errors.duration?.value && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.duration.value.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <select
                        {...register('duration.unit', { required: 'Duration unit is required' })}
                        className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                          errors.duration?.unit 
                            ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                        } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white`}
                      >
                        {DURATION_UNITS.map(unit => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                      {errors.duration?.unit && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.duration.unit.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-indigo-500" />
                    Location/Body Part
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Left temple, Lower back, Stomach"
                  />
                </motion.div>

                {/* Status */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                    Current Status
                  </label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 text-4xl">🔬</div>
              <div className="absolute top-8 right-8 text-3xl">📊</div>
              <div className="absolute bottom-4 left-8 text-2xl">💡</div>
              <div className="absolute bottom-8 right-4 text-3xl">🧪</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-pink-400/10 rounded-full blur-xl animate-float" />
            
            <div className="relative p-4 sm:p-6">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <BeakerIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Additional Details
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Provide more context and related information
                  </p>
                </div>
              </motion.div>
              
              <div className="space-y-6 sm:space-y-8">
                {/* Triggers */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FireIcon className="h-4 w-4 text-orange-500" />
                    Possible Triggers
                  </label>
                  <div className="space-y-3">
                    {triggerFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="flex gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          {...register(`triggers.${index}`)}
                          type="text"
                          className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="e.g., Stress, Certain foods, Weather"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeTrigger(index)}
                          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => addArrayField('triggers')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Trigger
                    </motion.button>
                  </div>
                </motion.div>

                {/* Associated Symptoms */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    Associated Symptoms
                  </label>
                  <div className="space-y-4">
                    {associatedSymptomFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          {...register(`associatedSymptoms.${index}.name`)}
                          type="text"
                          className="px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Symptom name"
                        />
                        <div className="flex gap-3">
                          <input
                            {...register(`associatedSymptoms.${index}.severity`)}
                            type="number"
                            min="1"
                            max="10"
                            className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="Severity (1-10)"
                          />
                          <motion.button
                            type="button"
                            onClick={() => removeAssociatedSymptom(index)}
                            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => addArrayField('associatedSymptoms')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Associated Symptom
                    </motion.button>
                  </div>
                </motion.div>

                {/* Vital Signs */}
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Temperature */}
                  <div>
                    <label htmlFor="temperature" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <BeakerIcon className="h-4 w-4 text-blue-500" />
                      Temperature (°F)
                    </label>
                    <input
                      {...register('temperature', {
                        min: { value: 95, message: 'Temperature seems too low' },
                        max: { value: 115, message: 'Temperature seems too high' }
                      })}
                      type="number"
                      step="0.1"
                      className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                        errors.temperature 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="e.g., 98.6"
                    />
                    {errors.temperature && (
                      <motion.p 
                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <XMarkIcon className="h-4 w-4" />
                        {errors.temperature.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Blood Pressure */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <HeartIcon className="h-4 w-4 text-red-500" />
                      Blood Pressure (mmHg)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          {...register('bloodPressure.systolic', {
                            min: { value: 50, message: 'Systolic seems too low' },
                            max: { value: 300, message: 'Systolic seems too high' }
                          })}
                          type="number"
                          className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                            errors.bloodPressure?.systolic 
                              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-red-500'
                          } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                          placeholder="Systolic"
                        />
                      </div>
                      <div>
                        <input
                          {...register('bloodPressure.diastolic', {
                            min: { value: 30, message: 'Diastolic seems too low' },
                            max: { value: 200, message: 'Diastolic seems too high' }
                          })}
                          type="number"
                          className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 ${
                            errors.bloodPressure?.diastolic 
                              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-red-500'
                          } rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                          placeholder="Diastolic"
                        />
                      </div>
                    </div>
                    {(errors.bloodPressure?.systolic || errors.bloodPressure?.diastolic) && (
                      <motion.p 
                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <XMarkIcon className="h-4 w-4" />
                        {errors.bloodPressure?.systolic?.message || errors.bloodPressure?.diastolic?.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Current Medications */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-green-500" />
                    Current Medications
                  </label>
                  <div className="space-y-4">
                    {medicationFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          {...register(`medications.${index}.name`)}
                          type="text"
                          className="px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Medication name"
                        />
                        <input
                          {...register(`medications.${index}.dosage`)}
                          type="text"
                          className="px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="Dosage"
                        />
                        <div className="flex gap-3">
                          <input
                            {...register(`medications.${index}.frequency`)}
                            type="text"
                            className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder="Frequency"
                          />
                          <motion.button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => addArrayField('medications')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Medication
                    </motion.button>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-indigo-500" />
                    Tags
                  </label>
                  <div className="space-y-3">
                    {tagFields.map((field, index) => (
                      <motion.div 
                        key={field.id} 
                        className="flex gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          {...register(`tags.${index}`)}
                          type="text"
                          className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          placeholder="e.g., Work-related, Exercise, Morning"
                        />
                        <motion.button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => addArrayField('tags')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Tag
                    </motion.button>
                  </div>
                </motion.div>

                {/* Notes */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500 rounded-xl shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Any additional information, observations, or context about this symptom..."
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Form Actions */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl mt-8 sm:mt-12"
            variants={itemVariants}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 text-4xl">✅</div>
              <div className="absolute top-8 right-8 text-3xl">🚀</div>
              <div className="absolute bottom-4 left-8 text-2xl">💾</div>
              <div className="absolute bottom-8 right-4 text-3xl">📝</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl animate-float" />
            
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <motion.button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Cancel</span>
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={createSymptomMutation.isLoading}
                  className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {createSymptomMutation.isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="text-sm sm:text-base">Logging Symptom...</span>
                    </>
                  ) : (
                    <>
                      <HeartSolid className="h-5 w-5" />
                      <span className="text-sm sm:text-base">Log Symptom</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}

export default AddSymptom
