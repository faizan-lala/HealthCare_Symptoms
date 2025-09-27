import { NavLink, useLocation } from 'react-router-dom'
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = isActive ? item.iconSolid : item.icon
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={clsx(
                'flex flex-col items-center justify-center space-y-1 transition-all duration-200',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                item.isAction && 'relative'
              )}
            >
              {item.isAction ? (
                <div className="absolute -top-2 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-110 active:scale-95">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <Icon className={clsx(
                  'w-6 h-6 transition-transform duration-200',
                  isActive && 'scale-110'
                )} />
              )}
              <span className={clsx(
                'text-xs font-medium transition-all duration-200',
                item.isAction ? 'mt-6' : '',
                isActive && 'font-semibold'
              )}>
                {item.name}
              </span>
              
              {/* Active indicator */}
              {isActive && !item.isAction && (
                <div className="absolute -top-0.5 w-8 h-0.5 bg-primary-500 rounded-full"></div>
              )}
            </NavLink>
          )
        })}
      </div>
      
      {/* Safe area padding for devices with home indicators */}
      <div className="h-4 bg-white dark:bg-gray-800 md:hidden"></div>
    </div>
  )
}

export default BottomNavigation
