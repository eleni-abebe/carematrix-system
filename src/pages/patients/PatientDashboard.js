import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Chip,
  Avatar,
  CardHeader,
  CardActionArea,
  CardMedia,
  CardActions,
  Rating,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Cancel as CancelIcon, 
  CheckCircle as CheckCircleIcon, 
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import * as api from '../../services/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState('upcoming');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch patient data
  const { data: patientData, isLoading: isLoadingPatient } = useQuery(
    ['patient', 'profile'],
    () => api.patients.getProfile().then(res => res.data),
    {
      onError: (error) => {
        console.error('Failed to load patient data:', error);
        toast.error('Failed to load patient data');
      },
    }
  );

  // Fetch appointments
  const { 
    data: appointments = [], 
    isLoading: isLoadingAppointments 
  } = useQuery(
    ['appointments', 'patient'],
    () => api.appointments.getAll().then(res => res.data),
    {
      select: (data) => {
        const now = new Date();
        return data.map(appt => ({
          ...appt,
          isUpcoming: new Date(appt.dateTime) > now,
          formattedDate: format(new Date(appt.dateTime), 'PPP')
        }));
      },
      onError: (error) => {
        console.error('Failed to load appointments:', error);
        toast.error('Failed to load appointments');
      },
    }
  );

  // Filter appointments based on tab
  const filteredAppointments = appointments.filter(appt => 
    tabValue === 'upcoming' ? appt.isUpcoming : !appt.isUpcoming
  );

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation(
    (appointmentId) => api.appointments.delete(appointmentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments', 'patient']);
        setOpenCancelDialog(false);
        toast.success('Appointment cancelled successfully');
      },
      onError: (error) => {
        console.error('Failed to cancel appointment:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel appointment');
      },
    }
  );

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      cancelAppointmentMutation.mutate(selectedAppointment.id);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoadingPatient || isLoadingAppointments) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {patientData?.firstName || 'Patient'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your appointments and health information.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/appointments/book')}
            startIcon={<BookmarkIcon />}
            size="large"
          >
            Book New Appointment
          </Button>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Upcoming
                </Typography>
              </Box>
              <Typography variant="h4">
                {appointments.filter(a => a.isUpcoming).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <HistoryIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Past
                </Typography>
              </Box>
              <Typography variant="h4">
                {appointments.filter(a => !a.isUpcoming).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Favorites
                </Typography>
              </Box>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MedicalServicesIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Health Score
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="h6" sx={{ ml: 1 }}>4.5/5</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" gutterBottom>
              My Appointments
            </Typography>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ mb: -3 }}
            >
              <Tab 
                value="upcoming" 
                label="Upcoming" 
                icon={<AccessTimeIcon fontSize="small" />} 
                iconPosition="start" 
              />
              <Tab 
                value="past" 
                label="Past" 
                icon={<HistoryIcon fontSize="small" />} 
                iconPosition="start" 
              />
            </Tabs>
          </Box>
          
          {filteredAppointments.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No {tabValue} appointments found.
              </Typography>
              {tabValue === 'upcoming' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/appointments/book')}
                  startIcon={<BookmarkIcon />}
                >
                  Book an Appointment
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredAppointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar 
                              src={appointment.doctor?.avatar} 
                              alt={appointment.doctor?.name}
                              sx={{ width: 48, height: 48, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6" component="div">
                                Dr. {appointment.doctor?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.doctor?.specialty}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" alignItems="center" mt={2} mb={1}>
                            <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {appointment.formattedDate} at {format(new Date(appointment.dateTime), 'p')}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.location || 'Main Hospital'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} mt={{ xs: 2, md: 0 }}>
                            {appointment.isUpcoming ? (
                              <>
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  size="small" 
                                  sx={{ mr: 1 }}
                                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleCancelAppointment(appointment)}
                                  disabled={cancelAppointmentMutation.isLoading}
                                >
                                  {cancelAppointmentMutation.isLoading ? 'Cancelling...' : 'Cancel'}
                                </Button>
                              </>
                            ) : (
                              <Chip 
                                label="Completed" 
                                color="success" 
                                variant="outlined" 
                                icon={<CheckCircleIcon />}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Health Summary Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Health Records
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                No recent health records found.
              </Typography>
              <Button size="small" color="primary">
                View All Records
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Medications
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                No upcoming medications scheduled.
              </Typography>
              <Button size="small" color="primary">
                View Medication Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Appointment Dialog */}
      <Dialog 
        open={openCancelDialog} 
        onClose={() => !cancelAppointmentMutation.isLoading && setOpenCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CancelIcon color="error" sx={{ mr: 1 }} />
            Cancel Appointment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to cancel your appointment with <strong>Dr. {selectedAppointment?.doctor?.name}</strong> on <strong>{selectedAppointment?.formattedDate}</strong> at <strong>{selectedAppointment?.time}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Note: Cancellations made less than 24 hours before the appointment may be subject to a fee.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenCancelDialog(false)} 
            disabled={cancelAppointmentMutation.isLoading}
          >
            No, Keep It
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            color="error" 
            variant="contained"
            disabled={cancelAppointmentMutation.isLoading}
            startIcon={cancelAppointmentMutation.isLoading ? <CircularProgress size={20} /> : <CancelIcon />}
          >
            {cancelAppointmentMutation.isLoading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;
