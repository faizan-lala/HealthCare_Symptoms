import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  LightBulbIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  LightBulbIcon as LightBulbIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'
import clsx from 'clsx'

const navigation = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon,
    iconSolid: HomeIconSolid 
  },
  { 
    name: 'History', 
    href: '/symptoms', 
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid 
  },
  { 
    name: 'Log', 
    href: '/symptoms/new', 
    icon: PlusCircleIcon,
    iconSolid: PlusCircleIconSolid,
    isAction: true
  },
  { 
    name: 'Insights', 
    href: '/suggestions', 
    icon: LightBulbIcon,
    iconSolid: LightBulbIconSolid 
  },
  { 
    name: 'Profile', 
    href: '/profile', 
    icon: UserIcon,
    iconSolid: UserIconSolid 
  }
]

const BottomNavigation = () => {
  const location = useLocation()

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 lg:hidden z-50 shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="grid grid-cols-5 h-18 px-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href
          const Icon = isActive ? item.iconSolid : item.icon
          
          return (
            <motion.div key={item.name} className="relative">
              <NavLink
                to={item.href}
                className={clsx(
                  'flex flex-col items-center justify-center space-y-1 h-full transition-all duration-300 relative group',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {item.isAction ? (
                  <motion.div 
                    className="absolute -top-3 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      boxShadow: [
                        "0 10px 25px rgba(59, 130, 246, 0.3)",
                        "0 15px 35px rgba(59, 130, 246, 0.4)",
                        "0 10px 25px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <Icon className={clsx(
                      'w-6 h-6 transition-all duration-200',
                      isActive && 'scale-110'
                    )} />
                    
                    {/* Animated background for active state */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 -m-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl"
                        layoutId="activeBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                )}
                
                <motion.span 
                  className={clsx(
                    'text-xs font-medium transition-all duration-200 relative z-10',
                    item.isAction ? 'mt-7' : 'mt-1',
                    isActive && 'font-semibold'
                  )}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                >
                  {item.name}
                </motion.span>
                
                {/* Active indicator */}
                {isActive && !item.isAction && (
                  <motion.div 
                    className="absolute -top-1 w-10 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </div>
      
      {/* Enhanced safe area padding for devices with home indicators */}
      <div className="h-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl"></div>
    </motion.div>
  )
}

export default BottomNavigation
