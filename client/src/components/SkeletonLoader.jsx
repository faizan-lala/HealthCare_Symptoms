import clsx from 'clsx'

const SkeletonLoader = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'rounded',
  animation = true
}) => {
  return (
    <div 
      className={clsx(
        'bg-gray-200 dark:bg-gray-700',
        width,
        height,
        rounded,
        animation && 'animate-pulse',
        className
      )}
    />
  )
}

// Card skeleton for symptom cards
export const SymptomCardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <SkeletonLoader width="w-10" height="h-10" rounded="rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader width="w-3/4" height="h-5" />
        <SkeletonLoader width="w-1/2" height="h-3" />
      </div>
    </div>
    <SkeletonLoader height="h-3" />
    <SkeletonLoader width="w-2/3" height="h-3" />
  </div>
)

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-center">
      <SkeletonLoader width="w-12" height="h-12" rounded="rounded-xl" />
      <div className="ml-5 flex-1 space-y-2">
        <SkeletonLoader width="w-3/4" height="h-4" />
        <SkeletonLoader width="w-1/2" height="h-6" />
      </div>
    </div>
    <div className="mt-4">
      <SkeletonLoader height="h-1.5" rounded="rounded-full" />
    </div>
  </div>
)

// Dashboard grid skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Hero skeleton */}
    <div className="glass-card p-8">
      <SkeletonLoader width="w-2/3" height="h-8" className="mb-4" />
      <SkeletonLoader width="w-1/2" height="h-4" className="mb-6" />
      <div className="flex space-x-4">
        <SkeletonLoader width="w-32" height="h-10" rounded="rounded-xl" />
        <SkeletonLoader width="w-28" height="h-10" rounded="rounded-xl" />
      </div>
    </div>

    {/* Stats grid skeleton */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Content grid skeleton */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="card">
        <div className="card-header">
          <SkeletonLoader width="w-1/3" height="h-5" />
        </div>
        <div className="card-body space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonLoader width="w-8" height="h-8" rounded="rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonLoader width="w-3/4" height="h-4" />
                <SkeletonLoader width="w-1/2" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <SkeletonLoader width="w-1/3" height="h-5" />
        </div>
        <div className="card-body space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonLoader height="h-4" />
              <SkeletonLoader width="w-3/4" height="h-3" />
              <SkeletonLoader width="w-1/2" height="h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default SkeletonLoader
