import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  LightBulbIcon,
  UserIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
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
    <motion.div 
      className="flex h-full flex-col bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* Header */}
      <motion.div 
        className="flex h-20 shrink-0 items-center px-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-primary-500/10 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-primary-900/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <HeartIconSolid className="h-7 w-7 text-white" />
          </motion.div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            HealthTracker
          </span>
        </motion.div>
      </motion.div>
      
      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-8">
        <ul role="list" className="flex flex-1 flex-col gap-y-8">
          <li>
            <ul role="list" className="space-y-2">
              {navigation.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-700 dark:text-primary-300 border-r-4 border-primary-500 shadow-md shadow-primary-500/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50',
                        'group flex gap-x-4 rounded-xl p-4 text-sm leading-6 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg transform relative overflow-hidden'
                      )
                    }
                    onClick={() => onClose?.()}
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0 relative z-10"
                        aria-hidden="true"
                      />
                    </motion.div>
                    <motion.span 
                      className="relative z-10"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {item.name}
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </li>
          
          {/* Quick Actions */}
          <motion.li 
            className="mt-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="p-5 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl shadow-inner border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <motion.span 
                  className="mr-3 text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  ⚡
                </motion.span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <NavLink
                    to="/symptoms/new"
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-3 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all duration-300 group backdrop-blur-sm"
                    onClick={() => onClose?.()}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-3" />
                    </motion.div>
                    <span className="font-medium">Log New Symptom</span>
                  </NavLink>
                </motion.div>
                <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <NavLink
                    to="/suggestions"
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-3 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all duration-300 group backdrop-blur-sm"
                    onClick={() => onClose?.()}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ 
                        scale: { type: "spring", stiffness: 400, damping: 17 },
                        rotate: { duration: 2, repeat: Infinity, repeatDelay: 4 }
                      }}
                    >
                      <SparklesIcon className="h-5 w-5 mr-3" />
                    </motion.div>
                    <span className="font-medium">Get AI Insights</span>
                  </NavLink>
                </motion.div>
              </div>
            </motion.div>
          </motion.li>
        </ul>
      </nav>
    </motion.div>
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar
