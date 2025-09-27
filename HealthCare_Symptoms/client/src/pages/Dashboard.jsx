import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  PlusIcon,
  HeartIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, formatDuration, getSeverityColorClass, getUrgencyColorClass } from '../utils/formatters'

const Dashboard = () => {
  const { user } = useAuth()

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg shadow-sm">
        <div className="px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-primary-100">
            Let's check in on your health today. How are you feeling?
          </p>
          <div className="mt-6">
            <Link
              to="/symptoms/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Log New Symptom
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {statsLoading ? (
                        <div className="h-6 w-8 pulse-loading"></div>
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Symptoms */}
        <div className="card">
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
        </div>

        {/* Recent Suggestions */}
        <div className="card">
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
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
      </div>
    </div>
  )
}

export default Dashboard
