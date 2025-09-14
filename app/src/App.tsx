import { ToastContainer } from 'react-toastify'
import './App.css'
import Router from './Router'
import { AuthProvider } from './hooks/useAuth'
import { UserDataProvider } from './hooks/useUserData'

function App() {

  return (
    <AuthProvider>

      <UserDataProvider>
        <Router />
      </UserDataProvider>

      <ToastContainer />
    </AuthProvider>
  )
}

export default App
