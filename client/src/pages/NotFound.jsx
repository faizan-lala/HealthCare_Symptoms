import { Link } from 'react-router-dom'
import { HomeIcon, HeartIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 dark:sm:border-gray-700 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
              <Link
                to="/"
                className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HeartIcon className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NotFound
