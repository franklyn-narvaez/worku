import { ToastContainer } from 'react-toastify'
import './App.css'
import Router from './Router'
import { AuthProvider } from './hooks/useAuth'

function App() {

  return (
    <AuthProvider>
      <Router />
      <ToastContainer />
    </AuthProvider>
  )
}

export default App
