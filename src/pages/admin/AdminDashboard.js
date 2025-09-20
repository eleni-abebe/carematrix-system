import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';

const AdminDashboard = () => {
  // TODO: Implement actual API calls
  const { data: doctors, isLoading: loadingDoctors } = useQuery('doctors', () =>
    fetch('https://api.example.com/doctors').then(res => res.json())
  );

  const { data: appointments, isLoading: loadingAppointments } = useQuery('appointments', () =>
    fetch('https://api.example.com/appointments').then(res => res.json())
  );

  // Calculate statistics
  const totalAppointments = appointments?.length || 0;
  const todayAppointments = appointments?.filter(app => {
    const appDate = new Date(app.date);
    const today = new Date();
    return appDate.toDateString() === today.toDateString();
  }).length || 0;

  const loading = loadingDoctors || loadingAppointments;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Appointments
              </Typography>
              <Typography variant="h3" component="div">
                {totalAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Today's Appointments
              </Typography>
              <Typography variant="h3" component="div">
                {todayAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Total Doctors
              </Typography>
              <Typography variant="h3" component="div">
                {doctors?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                Available Doctors
              </Typography>
              <Typography variant="h3" component="div">
                {doctors?.filter(d => d.available).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Doctor Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doctor Management
              </Typography>
              <Button
                component={RouterLink}
                to="/admin/doctors/add"
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
              >
                Add New Doctor
              </Button>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Specialty</TableCell>
                      <TableCell>Available</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      doctors?.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell>{doctor.name}</TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell>
                            {doctor.available ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              component={RouterLink}
                              to={`/admin/doctors/${doctor.id}/edit`}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
