import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const { theme, setTheme } = useTheme()
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      {...registerProfile('name', { required: 'Name is required' })}
                      type="text"
                      className={`input ${profileErrors.name ? 'input-error' : ''}`}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      {...registerProfile('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className={`input ${profileErrors.email ? 'input-error' : ''}`}
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      {...registerProfile('dateOfBirth')}
                      type="date"
                      className="input"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <select {...registerProfile('gender')} className="input">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        {...registerProfile('emergencyContact.name')}
                        type="text"
                        className="input"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        {...registerProfile('emergencyContact.phone')}
                        type="tel"
                        className="input"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship
                      </label>
                      <input
                        {...registerProfile('emergencyContact.relationship')}
                        type="text"
                        className="input"
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="btn btn-primary"
                  >
                    {profileSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Appearance
                </h3>
              </div>
              <div className="card-body">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', description: 'Light mode' },
                      { value: 'dark', label: 'Dark', description: 'Dark mode' },
                      { value: 'system', label: 'System', description: 'Follow system preference' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`relative border rounded-lg p-4 cursor-pointer focus:outline-none ${
                          theme === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          checked={theme === option.value}
                          onChange={(e) => setTheme(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                          {theme === option.value && (
                            <CheckIcon className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Data & Privacy
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Data Export
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Download all your health data
                    </div>
                  </div>
                  <button className="btn-outline text-sm">
                    Export Data
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Data Retention
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Manage how long we keep your data
                    </div>
                  </div>
                  <select className="input text-sm w-auto">
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="5years">5 Years</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Change Password
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`input pr-10 ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      className={`input pr-10 ${passwordErrors.newPassword ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                    type="password"
                    className={`input ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="btn btn-primary"
                  >
                    {passwordSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
            </div>
            <div className="card-body space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Receive health insights and reminders via email
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Push Notifications
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Get notified about important health updates
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Weekly Health Summary
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Receive a weekly summary of your health data
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Emergency Alerts
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Critical health alerts based on symptom analysis
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 opacity-50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Emergency alerts cannot be disabled for your safety.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
