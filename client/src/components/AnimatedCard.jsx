import { motion } from 'framer-motion'

const AnimatedCard = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard


