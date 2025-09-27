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
  TagIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Log New Symptom
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Record details about your symptoms to track your health and get personalized insights.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Quick Symptom Selection */}
        {commonSymptoms.length > 0 && (
          <div className="card animate-slide-up">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <HeartIcon className="h-5 w-5 mr-2 text-primary-500" />
                Quick Selection
                <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                  Popular
                </span>
              </h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {commonSymptoms.slice(0, 12).map((symptom, index) => (
                  <button
                    key={symptom.name}
                    type="button"
                    onClick={() => handleQuickSymptomSelect(symptom.name)}
                    className="interactive-card p-4 text-left group border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {symptom.name}
                      </div>
                      {symptom.source === 'user' && symptom.frequency > 0 && (
                        <div className="w-2 h-2 bg-primary-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      )}
                    </div>
                    {symptom.source === 'user' && symptom.frequency > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        Used {symptom.frequency} time{symptom.frequency !== 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Information
            </h3>
          </div>
          <div className="card-body space-y-6">
            {/* Symptom Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symptom Name *
              </label>
              <input
                {...register('name', { required: 'Symptom name is required' })}
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Headache, Chest pain, Nausea"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input"
                placeholder="Describe your symptom in detail..."
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Severity * (1 = Very Mild, 10 = Unbearable)
              </label>
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
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) => setSelectedSeverity(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Very Mild</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedSeverity}/10 - {SEVERITY_LABELS[selectedSeverity]}
                  </span>
                  <span>Unbearable</span>
                </div>
              </div>
              {errors.severity && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                  {errors.severity.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('duration.value', { 
                      required: 'Duration value is required',
                      min: { value: 0, message: 'Duration cannot be negative' }
                    })}
                    type="number"
                    min="0"
                    step="0.5"
                    className={`input ${errors.duration?.value ? 'input-error' : ''}`}
                    placeholder="e.g., 2"
                  />
                  {errors.duration?.value && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {errors.duration.value.message}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    {...register('duration.unit', { required: 'Duration unit is required' })}
                    className={`input ${errors.duration?.unit ? 'input-error' : ''}`}
                  >
                    {DURATION_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.duration?.unit && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {errors.duration.unit.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                Location/Body Part
              </label>
              <input
                {...register('location')}
                type="text"
                className="input"
                placeholder="e.g., Left temple, Lower back, Stomach"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Status
              </label>
              <select {...register('status')} className="input">
                {STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Additional Details
            </h3>
          </div>
          <div className="card-body space-y-6">
            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Possible Triggers
              </label>
              <div className="space-y-2">
                {triggerFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`triggers.${index}`)}
                      type="text"
                      className="input flex-1"
                      placeholder="e.g., Stress, Certain foods, Weather"
                    />
                    <button
                      type="button"
                      onClick={() => removeTrigger(index)}
                      className="btn-outline px-3"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('triggers')}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Trigger
                </button>
              </div>
            </div>

            {/* Associated Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Associated Symptoms
              </label>
              <div className="space-y-3">
                {associatedSymptomFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-2">
                    <input
                      {...register(`associatedSymptoms.${index}.name`)}
                      type="text"
                      className="input"
                      placeholder="Symptom name"
                    />
                    <div className="flex gap-2">
                      <input
                        {...register(`associatedSymptoms.${index}.severity`)}
                        type="number"
                        min="1"
                        max="10"
                        className="input"
                        placeholder="Severity (1-10)"
                      />
                      <button
                        type="button"
                        onClick={() => removeAssociatedSymptom(index)}
                        className="btn-outline px-3"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('associatedSymptoms')}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Associated Symptom
                </button>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature (°F)
                </label>
                <input
                  {...register('temperature', {
                    min: { value: 95, message: 'Temperature seems too low' },
                    max: { value: 115, message: 'Temperature seems too high' }
                  })}
                  type="number"
                  step="0.1"
                  className={`input ${errors.temperature ? 'input-error' : ''}`}
                  placeholder="e.g., 98.6"
                />
                {errors.temperature && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {errors.temperature.message}
                  </p>
                )}
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    {...register('bloodPressure.systolic', {
                      min: { value: 50, message: 'Systolic seems too low' },
                      max: { value: 300, message: 'Systolic seems too high' }
                    })}
                    type="number"
                    className="input"
                    placeholder="Systolic"
                  />
                  <input
                    {...register('bloodPressure.diastolic', {
                      min: { value: 30, message: 'Diastolic seems too low' },
                      max: { value: 200, message: 'Diastolic seems too high' }
                    })}
                    type="number"
                    className="input"
                    placeholder="Diastolic"
                  />
                </div>
                {(errors.bloodPressure?.systolic || errors.bloodPressure?.diastolic) && (
                  <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                    {errors.bloodPressure?.systolic?.message || errors.bloodPressure?.diastolic?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Medications
              </label>
              <div className="space-y-3">
                {medicationFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-2">
                    <input
                      {...register(`medications.${index}.name`)}
                      type="text"
                      className="input"
                      placeholder="Medication name"
                    />
                    <input
                      {...register(`medications.${index}.dosage`)}
                      type="text"
                      className="input"
                      placeholder="Dosage"
                    />
                    <div className="flex gap-2">
                      <input
                        {...register(`medications.${index}.frequency`)}
                        type="text"
                        className="input"
                        placeholder="Frequency"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="btn-outline px-3"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('medications')}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Medication
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                Tags
              </label>
              <div className="space-y-2">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`tags.${index}`)}
                      type="text"
                      className="input flex-1"
                      placeholder="e.g., Work-related, Exercise, Morning"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="btn-outline px-3"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('tags')}
                  className="btn-outline text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Tag
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input"
                placeholder="Any additional information, observations, or context about this symptom..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/symptoms')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createSymptomMutation.isLoading}
            className="btn btn-primary"
          >
            {createSymptomMutation.isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              'Log Symptom'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSymptom
