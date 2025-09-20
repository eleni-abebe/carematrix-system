import axios from 'axios';
import { toast } from 'react-hot-toast';
import mockApi, { mockDoctors } from './mockData';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Show error message
      const errorMessage = error.response.data?.message || 'An error occurred';
      toast.error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Mock authentication for development
const mockAuth = {
  login: async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would validate against a backend
    if (credentials.email && credentials.password) {
      const token = 'mock-jwt-token';
      const user = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: 'patient',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { data: { token, user } };
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (userData.email && userData.password) {
      const token = 'mock-jwt-token';
      const user = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'patient',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { data: { token, user } };
    } else {
      throw new Error('Registration failed');
    }
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { data: { success: true } };
  },
  
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      return { data: user };
    } else {
      throw new Error('Not authenticated');
    }
  },
  
  updateProfile: async (userData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { data: updatedUser };
  },
  
  changePassword: async () => {
    return { data: { success: true } };
  }
};

// API endpoints
export default {
  // Auth endpoints
  auth: isDevelopment ? mockAuth : {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/me', userData),
    changePassword: (passwords) => api.put('/auth/change-password', passwords),
  },
  
  // Appointments endpoints
  appointments: {
    getAll: (params) => isDevelopment 
      ? mockApi.getDoctors() // Using mock data for now
      : api.get('/appointments', { params }),
      
    getById: (id) => api.get(`/appointments/${id}`),
    create: (appointmentData) => api.post('/appointments', appointmentData),
    update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
    delete: (id) => api.delete(`/appointments/${id}`),
    cancel: (id) => api.post(`/appointments/${id}/cancel`),
    reschedule: (id, newDateTime) => api.post(`/appointments/${id}/reschedule`, { newDateTime }),
    getAvailableSlots: (doctorId, date) => 
      api.get(`/appointments/available-slots/${doctorId}`, { params: { date } }),
  },
  
  // Doctors endpoints
  doctors: {
    getAll: (params) => isDevelopment 
      ? mockApi.getDoctors(params)
      : api.get('/doctors', { params }),
      
    getById: (id) => isDevelopment 
      ? Promise.resolve({ 
          data: mockDoctors.find(doc => doc.id === id) || null 
        })
      : api.get(`/doctors/${id}`),
      
    getSpecialties: () => isDevelopment
      ? Promise.resolve({
          data: [...new Set(mockDoctors.map(doc => doc.specialty))].sort()
        })
      : api.get('/doctors/specialties'),
      
    getAvailability: (id, params) => isDevelopment
      ? Promise.resolve({
          data: {
            available: Math.random() > 0.3, // 70% chance of being available
            nextAvailable: new Date(Date.now() + 3600000 * (1 + Math.floor(Math.random() * 24))).toISOString(),
            slots: Array(3).fill().map((_, i) => 
              new Date(Date.now() + 3600000 * (i + 1)).toISOString()
            )
          }
        })
      : api.get(`/doctors/${id}/availability`, { params }),
  },
  
  // Patients endpoints
  patients: {
    getProfile: () => isDevelopment
      ? Promise.resolve({
          data: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            dateOfBirth: '1990-01-15',
            bloodType: 'A+',
            address: '123 Main St, Anytown, USA',
            emergencyContact: {
              name: 'Jane Doe',
              relationship: 'Spouse',
              phone: '+1987654321'
            },
            insurance: {
              provider: 'HealthPlus',
              policyNumber: 'HP123456789',
              expiryDate: '2025-12-31'
            },
            medicalHistory: [
              { date: '2023-01-15', condition: 'Hypertension', status: 'Controlled with medication' },
              { date: '2022-06-22', condition: 'Broken arm', status: 'Fully recovered' }
            ],
            allergies: ['Penicillin', 'Peanuts'],
            medications: [
              { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', for: 'Blood pressure' },
              { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', for: 'Cholesterol' }
            ]
          }
        })
      : api.get('/patients/me'),
      
    updateProfile: (patientData) => isDevelopment
      ? Promise.resolve({ data: patientData })
      : api.put('/patients/me', patientData),
      
    getMedicalHistory: () => isDevelopment
      ? Promise.resolve({
          data: [
            {
              id: '1',
              date: '2023-05-15',
              doctor: 'Dr. Sarah Johnson',
              specialty: 'Cardiology',
              diagnosis: 'Hypertension',
              notes: 'Patient presented with elevated blood pressure. Prescribed Lisinopril 10mg daily.',
              treatment: 'Medication prescribed',
              followUp: '3 months'
            },
            {
              id: '2',
              date: '2023-03-22',
              doctor: 'Dr. Michael Chen',
              specialty: 'Neurology',
              diagnosis: 'Migraine',
              notes: 'Patient reports frequent headaches. Recommended stress management techniques.',
              treatment: 'Prescribed Sumatriptan as needed',
              followUp: 'As needed'
            }
          ]
        })
      : api.get('/patients/me/medical-history'),
      
    getPrescriptions: () => isDevelopment
      ? Promise.resolve({
          data: [
            {
              id: 'rx1',
              medication: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              startDate: '2023-01-15',
              endDate: '2024-01-15',
              refills: 5,
              status: 'Active',
              prescribedBy: 'Dr. Sarah Johnson',
              notes: 'For blood pressure management'
            },
            {
              id: 'rx2',
              medication: 'Atorvastatin',
              dosage: '20mg',
              frequency: 'Once daily at bedtime',
              startDate: '2023-01-15',
              endDate: '2024-01-15',
              refills: 5,
              status: 'Active',
              prescribedBy: 'Dr. Sarah Johnson',
              notes: 'For cholesterol management'
            },
            {
              id: 'rx3',
              medication: 'Sumatriptan',
              dosage: '50mg',
              frequency: 'As needed for migraine',
              startDate: '2023-03-22',
              endDate: '2024-03-22',
              refills: 3,
              status: 'Active',
              prescribedBy: 'Dr. Michael Chen',
              notes: 'Take at first sign of migraine'
            }
          ]
        })
      : api.get('/patients/me/prescriptions'),
      
    getTestResults: () => isDevelopment
      ? Promise.resolve({
          data: [
            {
              id: 'test1',
              date: '2023-05-10',
              testName: 'Complete Blood Count (CBC)',
              orderedBy: 'Dr. Sarah Johnson',
              status: 'Completed',
              results: 'All values within normal range',
              notes: 'Routine blood work'
            },
            {
              id: 'test2',
              date: '2023-01-15',
              testName: 'Lipid Panel',
              orderedBy: 'Dr. Sarah Johnson',
              status: 'Completed',
              results: 'LDL: 110 mg/dL (slightly elevated)',
              notes: 'Follow-up in 6 months'
            }
          ]
        })
      : api.get('/patients/me/test-results'),
  },
  
  // Admin endpoints (minimal mock implementation)
  admin: {
    // Users
    getAllUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    createUser: (userData) => api.post('/admin/users', userData),
    updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    
    // Appointments
    getAllAppointments: (params) => api.get('/admin/appointments', { params }),
    updateAppointmentStatus: (id, status) => 
      api.put(`/admin/appointments/${id}/status`, { status }),
    
    // Reports
    getAppointmentStats: (params) => api.get('/admin/reports/appointment-stats', { params }),
    getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  },
};
