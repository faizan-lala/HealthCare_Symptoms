import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
  KeyIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { UserIcon as UserSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user?.gender || '',
      emergencyContact: {
        name: user?.emergencyContact?.name || '',
        phone: user?.emergencyContact?.phone || '',
        relationship: user?.emergencyContact?.relationship || ''
      }
    }
  })

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPasswordForm,
    watch
  } = useForm()

  const newPassword = watch('newPassword')

  const onProfileSubmit = async (data) => {
    const result = await updateProfile(data)
    if (result.success) {
      toast.success('Profile updated successfully!')
    }
  }

  const onPasswordSubmit = async (data) => {
    const result = await changePassword(data.currentPassword, data.newPassword)
    if (result.success) {
      resetPasswordForm()
      toast.success('Password changed successfully!')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 mx-4 sm:mx-6 lg:mx-8"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10" />
        <div className="relative px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <div className="flex items-center gap-6 mb-4">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <div className="flex-1">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Profile Settings
              </motion.h1>
              <motion.p 
                className="mt-3 text-gray-600 dark:text-gray-400 text-lg font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manage your account settings and preferences
              </motion.p>
            </div>
            <motion.div 
              className="hidden sm:flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/60 dark:border-blue-800/60 shadow-md">
                <UserSolid className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{user?.name}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 mt-8 sm:px-6 lg:px-8 pb-12">
        {/* Enhanced Tabs */}
        <motion.div 
          className="mb-2"
          variants={itemVariants}
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/40 shadow-xl p-3">
            <nav className="flex space-x-3">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-102'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-white/95 to-blue-50/40 dark:from-gray-800/95 dark:to-blue-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -3 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-6 left-6 text-5xl">👤</div>
                <div className="absolute top-12 right-12 text-4xl">📝</div>
                <div className="absolute bottom-6 left-12 text-3xl">✨</div>
              </div>
              
              <div className="relative p-6">
                <motion.div 
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
                    <UserIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                      Update your profile details and personal information
                    </p>
                  </div>
                </motion.div>
                
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Name */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-blue-500" />
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          {...registerProfile('name', { required: 'Name is required' })}
                          type="text"
                          className={`w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${
                            profileErrors.name 
                              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                          } rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl`}
                          placeholder="Enter your full name"
                        />
                        {!profileErrors.name && (
                          <motion.div 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <CheckIcon className="h-6 w-6 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      {profileErrors.name && (
                        <motion.p 
                          className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {profileErrors.name.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-purple-500" />
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          {...registerProfile('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          className="w-full px-5 py-4 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          disabled
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <KeyIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <KeyIcon className="h-4 w-4" />
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </motion.div>

                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Date of Birth */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="dateOfBirth" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-green-500" />
                        Date of Birth
                      </label>
                      <input
                        {...registerProfile('dateOfBirth')}
                        type="date"
                        className="w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white focus:shadow-xl"
                      />
                    </motion.div>

                    {/* Gender */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label htmlFor="gender" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-pink-500" />
                        Gender
                      </label>
                      <select 
                        {...registerProfile('gender')} 
                        className="w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white focus:shadow-xl"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </motion.div>
                  </div>

                  {/* Emergency Contact */}
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Emergency Contact
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Contact Name
                        </label>
                        <input
                          {...registerProfile('emergencyContact.name')}
                          type="text"
                          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl"
                          placeholder="Emergency contact name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          {...registerProfile('emergencyContact.phone')}
                          type="tel"
                          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl"
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Relationship
                        </label>
                        <input
                          {...registerProfile('emergencyContact.relationship')}
                          type="text"
                          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl"
                          placeholder="e.g., Spouse, Parent"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex justify-end pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={profileSubmitting}
                      className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {profileSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" color="white" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-6 w-6" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme Settings */}
              <motion.div 
                className="relative overflow-hidden bg-gradient-to-br from-white/95 to-purple-50/40 dark:from-gray-800/95 dark:to-purple-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="relative p-6">
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
                      <CogIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Appearance
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                        Customize your visual experience
                      </p>
                    </div>
                  </motion.div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-purple-500" />
                      Theme Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', description: 'Bright and clean', emoji: '☀️' },
                        { value: 'dark', label: 'Dark', description: 'Easy on the eyes', emoji: '🌙' },
                        { value: 'system', label: 'System', description: 'Follow device settings', emoji: '⚡' }
                      ].map((option, index) => (
                        <motion.label
                          key={option.value}
                          className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                            theme === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl transform scale-105'
                              : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-102'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={theme === option.value}
                            onChange={(e) => setTheme(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-3xl">{option.emoji}</span>
                              <div>
                                <div className="text-base font-bold text-gray-900 dark:text-white">
                                  {option.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                            {theme === option.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <CheckIcon className="h-5 w-5 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Data & Privacy */}
              <motion.div 
                className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/40 dark:from-gray-800/95 dark:to-green-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="relative p-6">
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl">
                      <DocumentArrowDownIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Data & Privacy
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                        Manage your data and privacy settings
                      </p>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div>
                        <div className="text-base font-bold text-gray-900 dark:text-white">
                          Data Export
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Download all your health data
                        </div>
                      </div>
                      <motion.button 
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                        Export Data
                      </motion.button>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div>
                        <div className="text-base font-bold text-gray-900 dark:text-white">
                          Data Retention
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Manage how long we keep your data
                        </div>
                      </div>
                      <select className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 rounded-xl shadow-lg text-gray-900 dark:text-white font-medium">
                        <option value="1year">1 Year</option>
                        <option value="2years">2 Years</option>
                        <option value="5years">5 Years</option>
                        <option value="forever">Forever</option>
                      </select>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-white/95 to-red-50/40 dark:from-gray-800/95 dark:to-red-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -3 }}
          >
            <div className="relative p-6">
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl">
                  <ShieldCheckIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Security Settings
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                    Manage your password and security preferences
                  </p>
                </div>
              </motion.div>
              
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                {/* Current Password */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <KeyIcon className="h-5 w-5 text-red-500" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${
                        passwordErrors.currentPassword 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-red-500'
                      } rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl pr-12`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="h-6 w-6 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <motion.p 
                      className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {passwordErrors.currentPassword.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* New Password */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                        }
                      })}
                      type={showNewPassword ? 'text' : 'password'}
                      className={`w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${
                        passwordErrors.newPassword 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                      } rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl pr-12`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-6 w-6 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <motion.p 
                      className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {passwordErrors.newPassword.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm New Password */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                    type="password"
                    className={`w-full px-5 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 ${
                      passwordErrors.confirmPassword 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-2xl shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:shadow-xl`}
                    placeholder="Confirm your new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <motion.p 
                      className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {passwordErrors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  className="flex justify-end pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="px-10 py-5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {passwordSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Changing Password...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-6 w-6" />
                        <span>Change Password</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-white/95 to-yellow-50/40 dark:from-gray-800/95 dark:to-yellow-900/30 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -3 }}
          >
            <div className="relative p-6">
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl">
                  <BellIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Notification Preferences
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                    Customize how you receive notifications
                  </p>
                </div>
              </motion.div>
              
              <div className="space-y-4">
                {[
                  {
                    id: 'email',
                    title: 'Email Notifications',
                    description: 'Receive health insights and reminders via email',
                    icon: SparklesIcon,
                    checked: true
                  },
                  {
                    id: 'push',
                    title: 'Push Notifications',
                    description: 'Get notified about important health updates',
                    icon: BellIcon,
                    checked: true
                  },
                  {
                    id: 'weekly',
                    title: 'Weekly Health Summary',
                    description: 'Receive a weekly summary of your health data',
                    icon: ClockIcon,
                    checked: true
                  },
                  {
                    id: 'emergency',
                    title: 'Emergency Alerts',
                    description: 'Critical health alerts based on symptom analysis',
                    icon: ShieldCheckIcon,
                    checked: true,
                    disabled: true
                  }
                ].map((notification, index) => {
                  const Icon = notification.icon
                  return (
                    <motion.div 
                      key={notification.id}
                      className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-200/50 dark:border-gray-600/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          notification.disabled 
                            ? 'bg-gray-400 dark:bg-gray-600' 
                            : 'bg-gradient-to-br from-yellow-500 to-orange-600'
                        }`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-base font-bold text-gray-900 dark:text-white">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={notification.checked}
                          disabled={notification.disabled}
                          className={`h-6 w-6 rounded border-2 ${
                            notification.disabled
                              ? 'border-gray-300 text-gray-400 opacity-50'
                              : 'border-yellow-500 text-yellow-600 focus:ring-yellow-500'
                          }`}
                        />
                        {notification.disabled && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Required
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div 
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Emergency alerts cannot be disabled for your safety.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </motion.div>
  )
}

export default Profile
