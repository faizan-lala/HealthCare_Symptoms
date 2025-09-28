import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  CheckIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const features = [
  {
    name: 'Smart Symptom Tracking',
    description: 'Log your symptoms with detailed information including severity, duration, and triggers.',
    icon: HeartIcon,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50 dark:bg-red-900/10',
    iconBg: 'bg-red-500'
  },
  {
    name: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your symptom patterns and medical guidelines.',
    icon: SparklesIcon,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
    iconBg: 'bg-purple-500'
  },
  {
    name: 'Health Analytics',
    description: 'Visualize your health trends and patterns over time with comprehensive charts.',
    icon: ChartBarIcon,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    iconBg: 'bg-blue-500'
  },
  {
    name: 'Privacy Focused',
    description: 'Your health data is encrypted and secure. We never share your personal information.',
    icon: ShieldCheckIcon,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
    iconBg: 'bg-green-500'
  },
  {
    name: 'Quick & Easy',
    description: 'Log symptoms in seconds with our intuitive interface and quick-action buttons.',
    icon: ClockIcon,
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/10',
    iconBg: 'bg-orange-500'
  },
  {
    name: 'Mobile Friendly',
    description: 'Access your health tracker anywhere with our responsive mobile-first design.',
    icon: DevicePhoneMobileIcon,
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/10',
    iconBg: 'bg-teal-500'
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Healthcare Professional',
    content: 'HealthTracker has revolutionized how I monitor my patients\' progress. The AI insights are incredibly accurate.',
    rating: 5,
    avatar: '👩‍⚕️'
  },
  {
    name: 'Michael Chen',
    role: 'Chronic Pain Patient',
    content: 'Finally, a tool that helps me understand my symptoms patterns. It\'s been life-changing for managing my condition.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Family Medicine',
    content: 'The detailed analytics help me make better treatment decisions. Highly recommend to all my colleagues.',
    rating: 5,
    avatar: '👩‍⚕️'
  }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
}

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const Landing = () => {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/20 dark:border-gray-700/20"
      >
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <motion.div 
            className="flex lg:flex-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex items-center group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <HeartIconSolid className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                HealthTracker
              </span>
            </div>
          </motion.div>
          <div className="flex lg:flex-1 lg:justify-end space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Log in <motion.span 
                  className="inline-block ml-1" 
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-hidden="true"
                >&rarr;</motion.span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="btn btn-primary text-sm shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.header>

      {/* Enhanced Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(120, 219, 255, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.15) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating Elements */}
          <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-400/30 to-purple-400/30 rounded-full blur-xl" />
          <motion.div variants={floatingVariants} animate="animate" className="absolute top-40 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full blur-xl" style={{animationDelay: '2s'}} />
          <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-1/3 w-40 h-40 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-xl" style={{animationDelay: '4s'}} />
        </div>
        
        {/* Mesh Background */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 via-purple-500 to-pink-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-5xl py-20 sm:py-32 lg:py-40">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8 flex justify-center">
              <motion.div 
                className="group relative rounded-full px-6 py-3 text-sm leading-6 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-primary-500" />
                  <span>AI-Powered Health Insights</span>
                  <motion.span 
                    className="inline-block"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.div>
            </motion.div>
            
            {/* Main Heading */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Take Control of Your{' '}
                <motion.span 
                  className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  Health Journey
                </motion.span>
              </h1>
            </motion.div>
            
            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="mt-8 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium">
                Track your symptoms with precision, understand complex patterns, and receive personalized health insights powered by advanced AI. 
                Transform your healthcare experience with intelligent monitoring and actionable recommendations.
              </p>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <span className="relative flex items-center space-x-2">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Start Tracking Today</span>
                  </span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="group inline-flex items-center text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 px-6 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Already have an account? 
                  <motion.span 
                    className="inline-block ml-1"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { value: "10K+", label: "Active Users", icon: UserGroupIcon },
                  { value: "50K+", label: "Symptoms Tracked", icon: HeartIcon },
                  { value: "98%", label: "Satisfaction Rate", icon: StarIcon },
                  { value: "24/7", label: "AI Monitoring", icon: SparklesIcon }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center group"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
        {/* Bottom Mesh */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Enhanced Features Section */}
      <section id="features" className="relative py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Everything you need
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Comprehensive Health Tracking
            </motion.p>
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our platform provides all the tools you need to monitor, understand, and improve your health with cutting-edge technology and medical expertise.
            </motion.p>
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="group relative"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 group-hover:border-transparent ${feature.bgColor} group-hover:bg-gradient-to-br group-hover:${feature.color}/5`}>
                    {/* Icon */}
                    <div className="flex items-center justify-center">
                      <motion.div 
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconBg} shadow-lg group-hover:shadow-xl mb-6`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                        {feature.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Hover Effect Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Trusted by Healthcare Professionals
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              See what medical professionals and patients are saying about HealthTracker
            </p>
          </motion.div>
          
          <motion.div 
            className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 group-hover:border-primary-200 dark:group-hover:border-primary-700">
                    {/* Stars */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-gray-900 dark:text-gray-100 leading-relaxed mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 dark:from-primary-700 dark:via-purple-700 dark:to-pink-700">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        
        <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to start your health journey?
            </motion.h2>
            <motion.p 
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join thousands of users who are taking control of their health with HealthTracker. Start your journey today.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="relative inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <span className="relative flex items-center space-x-2">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Get started for free</span>
                  </span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="group inline-flex items-center text-lg font-semibold text-white hover:text-white/80 transition-all duration-300 px-6 py-4 rounded-xl hover:bg-white/10"
                >
                  Sign in 
                  <motion.span 
                    className="inline-block ml-1"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust badges */}
            <motion.div 
              className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-white/80">
                <CheckIcon className="h-5 w-5" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckIcon className="h-5 w-5" />
                <span className="text-sm font-medium">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckIcon className="h-5 w-5" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <HeartIconSolid className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                HealthTracker
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 border-t border-gray-700 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-center text-sm text-gray-400">
                © 2024 HealthTracker. Your health, our priority.
              </p>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
