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
  FireIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/symptoms"
            className="btn-outline p-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {symptom.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Logged on {formatDate(symptom.createdAt, 'MMMM d, yyyy \'at\' h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/symptoms/${id}/edit`}
            className="btn-outline"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Severity and Status */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${getSeverityColorClass(symptom.severity)}`}>
                    <HeartIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Severity</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {symptom.severity}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formatSeverity(symptom.severity)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColorClass(symptom.status)}`}>
                    {formatStatus(symptom.status)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {symptom.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {symptom.description}
                  </p>
                </div>
              )}

              {/* Associated Symptoms */}
              {symptom.associatedSymptoms && symptom.associatedSymptoms.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Associated Symptoms
                  </h3>
                  <div className="space-y-2">
                    {symptom.associatedSymptoms.map((assocSymptom, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {assocSymptom.name}
                        </span>
                        {assocSymptom.severity && (
                          <span className={`px-2 py-1 rounded text-sm ${getSeverityColorClass(assocSymptom.severity)}`}>
                            {assocSymptom.severity}/10
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggers */}
              {symptom.triggers && symptom.triggers.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Possible Triggers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {symptom.triggers.map((trigger, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {symptom.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Additional Notes
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {symptom.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              {/* Quick Facts */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Quick Facts</h3>
                
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Duration: {formatDuration(symptom.duration)}
                  </span>
                </div>

                {symptom.location && (
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Location: {symptom.location}
                    </span>
                  </div>
                )}

                {symptom.temperature && (
                  <div className="flex items-center text-sm">
                    <FireIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Temperature: {formatTemperature(symptom.temperature)}
                    </span>
                  </div>
                )}

                {symptom.bloodPressure && (symptom.bloodPressure.systolic || symptom.bloodPressure.diastolic) && (
                  <div className="flex items-center text-sm">
                    <HeartIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Blood Pressure: {formatBloodPressure(symptom.bloodPressure)}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {symptom.tags && symptom.tags.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <TagIcon className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {symptom.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {symptom.medications && symptom.medications.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Current Medications
                  </h3>
                  <div className="space-y-2">
                    {symptom.medications.map((med, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {med.name}
                        </div>
                        {(med.dosage || med.frequency) && (
                          <div className="text-gray-600 dark:text-gray-300">
                            {med.dosage} {med.frequency && `• ${med.frequency}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Health Insights for this Symptom
            </h3>
          </div>
          <div className="card-body">
            {suggestionsLoading ? (
              <div className="text-center py-6">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      suggestion.urgency === 'emergency'
                        ? 'border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/20'
                        : suggestion.urgency === 'urgent'
                        ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                        : suggestion.urgency === 'moderate'
                        ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20'
                        : 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {suggestion.action}
                      </h4>
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/50 dark:bg-black/20">
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {suggestion.reasoning}
                    </p>
                    {suggestion.nextSteps && suggestion.nextSteps.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Recommended Actions:
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {suggestion.nextSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
    </div>
  )
}

export default SymptomDetail
