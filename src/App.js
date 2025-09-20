import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-hot-toast';

// Providers
import { QueryClientProvider } from './providers/QueryClientProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DoctorList from './pages/doctors/DoctorList';
import AppointmentBooking from './pages/appointments/AppointmentBooking';
import PatientDashboard from './pages/patients/PatientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ roles = [], children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

// Public Only Route Component
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />;
  }

  return children || <Outlet />;
};

function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="doctors" element={<DoctorList />} />
                
                {/* Auth Routes - Only for non-authenticated users */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute roles={['patient']} />}>
                  <Route path="appointments/book" element={<AppointmentBooking />} />
                  <Route path="patient/dashboard" element={<PatientDashboard />} />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
          <ToastContainer 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '8px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
