import { Link } from 'react-router-dom'
import {
  HeartIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Smart Symptom Tracking',
    description: 'Log your symptoms with detailed information including severity, duration, and triggers.',
    icon: HeartIcon,
  },
  {
    name: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your symptom patterns and medical guidelines.',
    icon: LightBulbIcon,
  },
  {
    name: 'Health Analytics',
    description: 'Visualize your health trends and patterns over time with comprehensive charts.',
    icon: ChartBarIcon,
  },
  {
    name: 'Privacy Focused',
    description: 'Your health data is encrypted and secure. We never share your personal information.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Quick & Easy',
    description: 'Log symptoms in seconds with our intuitive interface and quick-action buttons.',
    icon: ClockIcon,
  },
  {
    name: 'Mobile Friendly',
    description: 'Access your health tracker anywhere with our responsive mobile-first design.',
    icon: DevicePhoneMobileIcon,
  },
]

const Landing = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                HealthTracker
              </span>
            </div>
          </div>
          <div className="flex lg:flex-1 lg:justify-end space-x-4">
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to="/register"
              className="btn btn-primary text-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
            <div className="animate-float absolute top-20 left-1/4 w-32 h-32 bg-primary-400/20 rounded-full blur-xl"></div>
            <div className="animate-float absolute top-40 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" style={{animationDelay: '1s'}}></div>
            <div className="animate-float absolute bottom-40 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-xl" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <div className="animate-slide-down">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-6 py-3 text-sm leading-6 text-gray-600 dark:text-gray-400 ring-1 ring-gray-900/10 dark:ring-gray-800 hover:ring-gray-900/20 dark:hover:ring-gray-700 transition-all duration-300">
                  AI-Powered Health Insights{' '}
                  <a href="#features" className="font-semibold text-primary-600 dark:text-primary-400">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                Take Control of Your{' '}
                <span className="gradient-text animate-glow">Health Journey</span>
              </h1>
            </div>
            
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Track your symptoms with precision, understand complex patterns, and receive personalized health insights powered by advanced AI. 
                Transform your healthcare experience with intelligent monitoring and actionable recommendations.
              </p>
            </div>
            
            <div className="animate-slide-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-6" style={{animationDelay: '0.4s'}}>
              <Link to="/register" className="btn btn-primary text-base px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                🚀 Start Tracking Today
              </Link>
              <Link
                to="/login"
                className="group text-base font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
              >
                Already have an account? 
                <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="animate-fade-in mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center" style={{animationDelay: '0.6s'}}>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">10K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">50K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Symptoms Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">98%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">24/7</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">AI Monitoring</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-purple-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Feature section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="animate-slide-up">
            <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Comprehensive Health Tracking
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Our platform provides all the tools you need to monitor, understand, and improve your health with cutting-edge technology.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-6xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 lg:gap-y-16">
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className="interactive-card relative p-6 group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 group-hover:from-primary-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </dd>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Additional value proposition */}
        <div className="mt-24 text-center">
          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Healthcare Professionals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform is designed with input from medical professionals and follows best practices for health data management and analysis.
            </p>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600 dark:bg-primary-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start your health journey?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of users who are taking control of their health with HealthTracker.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started for free
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-white hover:text-primary-100"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex justify-center">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                HealthTracker
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            © 2024 HealthTracker. Your health, our priority.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
