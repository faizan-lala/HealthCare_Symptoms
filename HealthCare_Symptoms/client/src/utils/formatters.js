import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return 'Today'
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }
  
  return format(dateObj, formatString)
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format duration for display
export const formatDuration = (duration) => {
  if (!duration || !duration.value || !duration.unit) return ''
  
  const { value, unit } = duration
  const singular = {
    minutes: 'minute',
    hours: 'hour',
    days: 'day',
    weeks: 'week',
    months: 'month'
  }
  
  const unitText = value === 1 ? singular[unit] : unit
  return `${value} ${unitText}`
}

// Format severity level
export const formatSeverity = (severity) => {
  const severityMap = {
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
  
  return severityMap[severity] || `Level ${severity}`
}

// Get severity color class
export const getSeverityColorClass = (severity) => {
  if (severity <= 2) return 'severity-1'
  if (severity <= 5) return 'severity-3'
  if (severity <= 7) return 'severity-6'
  return 'severity-8'
}

// Get urgency color class
export const getUrgencyColorClass = (urgency) => {
  return `urgency-${urgency}`
}

// Format temperature
export const formatTemperature = (temp, unit = 'F') => {
  if (!temp) return ''
  return `${temp}°${unit}`
}

// Format blood pressure
export const formatBloodPressure = (bp) => {
  if (!bp || !bp.systolic || !bp.diastolic) return ''
  return `${bp.systolic}/${bp.diastolic} mmHg`
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Format status
export const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    improving: 'Improving',
    resolved: 'Resolved',
    worsening: 'Worsening'
  }
  
  return statusMap[status] || capitalize(status)
}

// Get status color class
export const getStatusColorClass = (status) => {
  const statusColors = {
    active: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20',
    improving: 'text-success-600 bg-success-50 dark:bg-success-900/20',
    resolved: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
    worsening: 'text-danger-600 bg-danger-50 dark:bg-danger-900/20'
  }
  
  return statusColors[status] || 'text-gray-600 bg-gray-50'
}

// Format confidence percentage
export const formatConfidence = (confidence) => {
  if (typeof confidence !== 'number') return ''
  return `${Math.round(confidence)}%`
}

// Format list of items
export const formatList = (items, maxItems = 3) => {
  if (!Array.isArray(items) || items.length === 0) return ''
  
  if (items.length <= maxItems) {
    return items.join(', ')
  }
  
  const displayed = items.slice(0, maxItems).join(', ')
  const remaining = items.length - maxItems
  return `${displayed} +${remaining} more`
}
