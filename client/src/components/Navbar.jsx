import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import clsx from 'clsx'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { theme, currentTheme, toggleTheme } = useTheme()

  const themeIcons = {
    light: SunIcon,
    dark: MoonIcon,
    system: ComputerDesktopIcon
  }

  const ThemeIcon = themeIcons[theme]

  return (
    <motion.div 
      className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-white/20 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60 px-4 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20 sm:gap-x-6 sm:px-6 lg:px-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mobile menu button */}
      <motion.button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
        onClick={onMenuClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </motion.button>

      {/* Separator */}
      <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* App logo/title for mobile */}
          <motion.div 
            className="flex items-center lg:hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mr-3">
              <HeartIconSolid className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              HealthTracker
            </h1>
          </motion.div>

          {/* Search bar - hidden on mobile, shown on larger screens */}
          <motion.div 
            className="hidden md:flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="search"
                placeholder="Search symptoms, insights..."
                className="block w-64 lg:w-80 rounded-xl border-0 bg-white/60 dark:bg-gray-800/60 py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ring-1 ring-inset ring-gray-300/20 dark:ring-gray-600/20 focus:ring-2 focus:ring-inset focus:ring-primary-500 text-sm transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80 focus:bg-white dark:focus:bg-gray-800"
              />
            </div>
          </motion.div>
        </div>

        <div className="ml-auto flex items-center gap-x-2 lg:gap-x-4">
          {/* Theme toggle */}
          <motion.button
            type="button"
            className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">Toggle theme</span>
            <ThemeIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            type="button"
            className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">2</span>
            </span>
          </motion.button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-8 lg:w-px lg:bg-gradient-to-b lg:from-transparent lg:via-gray-300 lg:to-transparent dark:lg:via-gray-600" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Menu.Button className="flex items-center gap-x-3 rounded-xl bg-white/50 dark:bg-gray-800/50 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 ring-1 ring-gray-300/20 dark:ring-gray-600/20">
                <span className="sr-only">Open user menu</span>
                {user?.profileImage ? (
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50 ring-2 ring-white dark:ring-gray-800"
                    src={user.profileImage}
                    alt=""
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-white mr-2" aria-hidden="true">
                    {user?.name}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </span>
              </Menu.Button>
            </motion.div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl py-2 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700/20 focus:outline-none border border-gray-200/20 dark:border-gray-700/20">
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {user?.email}
                  </p>
                </div>
                
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={clsx(
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300',
                          'flex items-center px-4 py-2 text-sm font-medium transition-colors duration-150'
                        )}
                      >
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Profile Settings
                      </a>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={clsx(
                          active ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300',
                          'flex w-full items-center px-4 py-2 text-sm font-medium transition-colors duration-150'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar
