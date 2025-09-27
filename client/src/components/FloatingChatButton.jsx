import { useState } from 'react'
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import SymptomChatbot from './SymptomChatbot'

const FloatingChatButton = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-20 right-6 lg:bottom-6 lg:right-6 z-40 w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 hover:from-primary-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:rotate-3 transition-all duration-500 flex items-center justify-center group animate-bounce-gentle"
        title="Ask Symptom Helper"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 opacity-50 blur-xl animate-pulse"></div>
        
        {/* Main icon */}
        <div className="relative z-10">
          <ChatBubbleLeftEllipsisIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        {/* Enhanced notification dot */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        
        {/* Multiple ripple effects */}
        <div className="absolute inset-0 rounded-2xl bg-primary-400 opacity-40 animate-ping"></div>
        <div className="absolute inset-0 rounded-2xl bg-purple-400 opacity-30 animate-ping" style={{animationDelay: '0.5s'}}></div>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45"></div>
      </button>

      {/* Enhanced Tooltip */}
      <div className="fixed bottom-20 right-24 lg:bottom-6 lg:right-24 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white rounded-xl shadow-2xl border border-gray-700 dark:border-gray-600 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Symptom Helper</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Get instant health insights with our AI-powered assistant! 🩺✨
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-4 py-2">
            <p className="text-xs font-medium text-white">Click to start assessment</p>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-gray-800 dark:bg-gray-700 rotate-45 border-r border-b border-gray-700 dark:border-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Pulsing hint for first-time users */}
      <div className="fixed bottom-16 right-2 lg:bottom-2 lg:right-2 z-30 animate-bounce pointer-events-none">
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs px-3 py-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          NEW! 🆕
        </div>
      </div>

      {/* Symptom Chatbot Modal */}
      <SymptomChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </>
  )
}

export default FloatingChatButton
