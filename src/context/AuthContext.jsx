import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = (email, password) => {
    // Simulação de login - depois você pode integrar com backend
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      return { success: true }
    }
    
    return { success: false, message: 'Email ou senha incorretos' }
  }

  const register = (userData) => {
    // Simulação de registro - depois você pode integrar com backend
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email já cadastrado' }
    }
    
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
