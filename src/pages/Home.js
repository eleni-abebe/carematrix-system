import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  // TODO: Implement actual API calls
  const { data: stats, isLoading } = useQuery('home-stats', () =>
    fetch('https://api.example.com/stats').then(res => res.json())
  );

  const features = [
    {
      title: 'Find Doctors',
      description: 'Search and find qualified doctors in your area',
      link: '/doctors',
    },
    {
      title: 'Book Appointments',
      description: 'Schedule appointments with your preferred doctors',
      link: '/appointments/book',
    },
    {
      title: 'Patient Portal',
      description: 'Manage your appointments and health records',
      link: '/patient/dashboard',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Our Hospital Booking System
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            Schedule appointments with qualified doctors and manage your healthcare easily
          </Typography>
          <Button
            component={RouterLink}
            to="/doctors"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 3 }}
          >
            Find a Doctor
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Our Services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={feature.link}
                    variant="outlined"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography variant="h3" component="div" gutterBottom>
                    {stats?.totalDoctors}
                  </Typography>
                  <Typography variant="h6" component="div">
                    Qualified Doctors
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
