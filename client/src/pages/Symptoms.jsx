import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Symptom History
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Track and manage your health symptoms over time
          </p>
        </div>
        <Link
          to="/symptoms/new"
          className="btn btn-primary shadow-lg"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Log New Symptom
        </Link>
      </div>

      {/* Filters */}
      <div className="card animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="improving">Improving</option>
              <option value="resolved">Resolved</option>
              <option value="worsening">Worsening</option>
            </select>

            {/* Severity Filter */}
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="input"
            >
              <option value="">All Severities</option>
              <option value="1">Mild (1-3)</option>
              <option value="4">Moderate (4-6)</option>
              <option value="7">Severe (7-10)</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ search: '', status: '', severity: '', page: 1, limit: 10 })}
              className="btn-outline"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Symptoms List */}
      <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
        <div className="card-body p-0">
          {symptoms.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No symptoms found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {filters.search || filters.status || filters.severity
                  ? 'Try adjusting your filters'
                  : 'Start by logging your first symptom'
                }
              </p>
              <Link to="/symptoms/new" className="btn btn-primary">
                <PlusIcon className="h-4 w-4 mr-2" />
                Log First Symptom
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {symptoms.map((symptom, index) => (
                <Link
                  key={symptom._id}
                  to={`/symptoms/${symptom._id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Severity Indicator */}
                        <div className={`p-3 rounded-xl ${getSeverityColorClass(symptom.severity)} shadow-sm`}>
                          <HeartIcon className="h-5 w-5" />
                        </div>

                        {/* Symptom Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {symptom.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(symptom.status)}`}>
                              {formatStatus(symptom.status)}
                            </span>
                          </div>

                          {/* Symptom Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <div className="flex items-center">
                              <span className="font-medium">Severity:</span>
                              <span className="ml-1">{symptom.severity}/10 ({formatSeverity(symptom.severity)})</span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{formatDuration(symptom.duration)}</span>
                            </div>
                            {symptom.location && (
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                <span>{symptom.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {symptom.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                              {symptom.description}
                            </p>
                          )}

                          {/* Associated Symptoms */}
                          {symptom.associatedSymptoms && symptom.associatedSymptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {symptom.associatedSymptoms.slice(0, 3).map((s, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                >
                                  {s.name}
                                </span>
                              ))}
                              {symptom.associatedSymptoms.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{symptom.associatedSymptoms.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(symptom.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(symptom.createdAt, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1
                const isActive = page === pagination.current
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Symptoms