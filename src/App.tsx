import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { PropertyProvider } from '@/contexts/PropertyContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { AuthCallback } from '@/pages/AuthCallback'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { ReservationForm } from '@/pages/ReservationForm'
import { Calendar } from '@/pages/Calendar'
import { Settings } from '@/pages/Settings'
import { FlashSale } from '@/pages/FlashSale'
import { FAQ } from '@/pages/FAQ'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation-form"
            element={
              <ProtectedRoute>
                <ReservationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flash-sale"
            element={
              <ProtectedRoute>
                <FlashSale />
              </ProtectedRoute>
            }
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
