import React from 'react'
import { AuthProvider } from './context/AuthProvider'
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App