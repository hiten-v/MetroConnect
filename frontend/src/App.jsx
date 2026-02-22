import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MetroProvider }  from './context/MetroContext'
import { BookingProvider } from './context/BookingContext'
import { AuthProvider }   from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'
import Navbar       from './components/common/Navbar'
import PassengerPage from './pages/PassengerPage'
import AdminPage    from './pages/AdminPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MetroProvider>
          <BookingProvider>
            <div className="min-h-screen bg-app text-[#e8eaf6] font-sans">
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/login"  element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected — must be logged in */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <PassengerPage />
                  </ProtectedRoute>
                } />

                {/* Admin only */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BookingProvider>
        </MetroProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <span className="text-6xl">🚇</span>
      <h2 className="text-2xl font-bold">404 – Station Not Found</h2>
      <a href="/" className="text-accent hover:text-accent-h underline">← Back to booking</a>
    </div>
  )
}