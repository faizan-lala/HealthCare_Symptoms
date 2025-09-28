import { useState } from 'react'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import SymptomChatbot from './SymptomChatbot'

const FloatingChatButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <>
      {/* Enhanced Healthcare-Themed Floating Chat Button */}
      <motion.button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-20 right-6 lg:bottom-6 lg:right-6 z-40 w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 hover:from-blue-600 hover:via-green-600 hover:to-teal-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform flex items-center justify-center group"
        title="Ask Dr. Helper - AI Medical Assistant"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          hover: { duration: 0.3, ease: "easeOut" }
        }}
      >
        {/* Healthcare background glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-green-500 opacity-40 blur-xl animate-pulse"></div>
        
        {/* Medical cross pattern overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-10">
          <div className="absolute top-2 left-2 text-white text-lg">🏥</div>
          <div className="absolute bottom-2 right-2 text-white text-lg">💊</div>
        </div>
        
        {/* Main medical icon */}
        <div className="relative z-10 flex items-center justify-center">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🩺</span>
        </div>
        
        {/* Enhanced medical notification dot */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <motion.div 
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        
        {/* Medical-themed ripple effects */}
        <motion.div 
          className="absolute inset-0 rounded-2xl bg-blue-400 opacity-30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute inset-0 rounded-2xl bg-green-400 opacity-20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Medical cross shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45"></div>
      </motion.button>

      {/* Enhanced Healthcare Tooltip */}
      <motion.div 
        className="fixed bottom-20 right-24 lg:bottom-6 lg:right-24 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-2 group-hover:translate-x-0"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 0, x: 0 }}
        whileHover={{ opacity: 1, x: -8 }}
      >
        <div className="bg-gradient-to-r from-blue-900 to-green-800 dark:from-blue-800 dark:to-green-700 text-white rounded-2xl shadow-2xl border border-blue-700 dark:border-blue-600 overflow-hidden backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🩺</span>
              <span className="text-sm font-bold">Dr. Helper</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              AI-powered medical assistant ready to help with your symptoms! 
              <span className="block mt-1 font-medium">🏥 Professional • 🔒 Secure • ⚡ Instant</span>
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-4 py-2">
            <p className="text-xs font-medium text-white flex items-center">
              <span className="mr-1">👆</span>
              Click to start health assessment
            </p>
          </div>
          
          {/* Enhanced tooltip arrow */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-800 dark:bg-blue-700 rotate-45 border-r border-b border-blue-700 dark:border-blue-600"></div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced medical hint for first-time users */}
      <motion.div 
        className="fixed bottom-16 right-2 lg:bottom-2 lg:right-2 z-30 pointer-events-none"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
          <span className="flex items-center space-x-1">
            <span>🆕</span>
            <span className="font-semibold">AI Doctor</span>
          </span>
        </div>
      </motion.div>

      {/* Symptom Chatbot Modal */}
      <SymptomChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </>
  )
}

export default FloatingChatButton
