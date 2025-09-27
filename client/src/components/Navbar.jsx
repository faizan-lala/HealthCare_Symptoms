import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
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
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* App title for mobile */}
          <div className="flex items-center lg:hidden">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              HealthTracker
            </h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
          >
            <span className="sr-only">Toggle theme</span>
            <ThemeIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              {user?.profileImage ? (
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={user.profileImage}
                  alt=""
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white" aria-hidden="true">
                  {user?.name}
                </span>
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={clsx(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300'
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
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Navbar
