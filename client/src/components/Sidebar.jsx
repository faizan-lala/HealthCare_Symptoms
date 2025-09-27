import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import {
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  LightBulbIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Log Symptoms', href: '/symptoms/new', icon: PlusCircleIcon },
  { name: 'Symptom History', href: '/symptoms', icon: DocumentTextIcon },
  { name: 'Suggestions', href: '/suggestions', icon: LightBulbIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon }
]

const Sidebar = ({ isOpen, onClose }) => {
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center animate-slide-right">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg animate-glow">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold gradient-text">
            HealthTracker
          </span>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2">
              {navigation.map((item, index) => (
                <li key={item.name} className="animate-slide-right" style={{animationDelay: `${index * 0.1}s`}}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600',
                        'group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md transform'
                      )
                    }
                    onClick={() => onClose?.()}
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0 group-hover:scale-110 transition-transform duration-300"
                      aria-hidden="true"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          
          {/* Quick actions */}
          <li className="mt-auto animate-slide-up">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-inner">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <NavLink
                  to="/symptoms/new"
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 group"
                  onClick={() => onClose?.()}
                >
                  <PlusCircleIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Log New Symptom</span>
                </NavLink>
                <NavLink
                  to="/suggestions"
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 group"
                  onClick={() => onClose?.()}
                >
                  <LightBulbIcon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Get AI Insights</span>
                </NavLink>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar
