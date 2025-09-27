import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import {
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Health Insights & Suggestions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get AI-powered health insights based on your symptom patterns and receive personalized recommendations.
        </p>
      </div>

      {/* Symptom Analysis Section */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Symptom Analysis
            </h3>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn btn-primary text-sm"
            >
              {isAnalyzing ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Analysis Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Analysis Scope
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="recent"
                  checked={analysisType === 'recent'}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Recent symptoms (24 hours)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={analysisType === 'all'}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  All active symptoms (7 days)
                </span>
              </label>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Analysis Summary
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(analysis.analysisDate)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Symptoms Analyzed:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {analysis.analyzedSymptoms?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {analysis.confidence}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Suggestions:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {analysis.suggestions?.length || 0}
                    </span>
                  </div>
                </div>
                {analysis.reasoning && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {analysis.reasoning}
                    </p>
                  </div>
                )}
              </div>

              {/* Analyzed Symptoms */}
              {analysis.analyzedSymptoms && analysis.analyzedSymptoms.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Analyzed Symptoms
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.analyzedSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {symptom.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Severity: {symptom.severity}/10
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(symptom.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Disclaimer:</strong> {analysis.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Analysis Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Click "Analyze Symptoms" to get AI-powered insights based on your logged symptoms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* General Health Recommendations */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            General Health Recommendations
          </h3>
        </div>
        <div className="card-body">
          {recommendationsLoading ? (
            <div className="text-center py-6">
              <LoadingSpinner size="md" />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      recommendation.priority === 'high'
                        ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300'
                        : recommendation.priority === 'medium'
                        ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {recommendation.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {recommendation.description}
                  </p>

                  {recommendation.actions && recommendation.actions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recommended Actions:
                      </h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {recommendation.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-current flex-shrink-0"></span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Recommendations Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start logging symptoms to receive personalized health recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Health Tips */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            General Health Tips
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Daily Wellness
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Stay hydrated (8 glasses of water daily)</li>
                <li>• Get 7-9 hours of quality sleep</li>
                <li>• Exercise regularly (30 minutes, 5 days/week)</li>
                <li>• Practice stress management techniques</li>
                <li>• Maintain a balanced diet</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Symptom Tracking
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Log symptoms as soon as they occur</li>
                <li>• Be detailed and specific</li>
                <li>• Note potential triggers</li>
                <li>• Track medication effects</li>
                <li>• Monitor patterns over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suggestions
