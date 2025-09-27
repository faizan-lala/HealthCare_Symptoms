import { createContext, useContext, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()

  const socket = useMemo(() => {
    const url = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'
    const s = io(url, { withCredentials: true, autoConnect: true })
    return s
  }, [])

  useEffect(() => {
    if (user?._id) {
      socket.emit('register', user._id)
    }
  }, [user, socket])

  useEffect(() => {
    return () => {
      socket.close()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)


