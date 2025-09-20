import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

const validationSchema = Yup.object().shape({
  doctorId: Yup.string().required('Doctor is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  symptoms: Yup.string().min(10, 'Symptoms must be at least 10 characters').required('Symptoms are required'),
});

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');

  // TODO: Implement actual API calls
  const { data: doctor } = useQuery(
    ['doctor', doctorId],
    () => fetch(`https://api.example.com/doctors/${doctorId}`).then(res => res.json())
  );

  const { data: availableTimes } = useQuery(
    ['availableTimes', doctorId],
    () => fetch(`https://api.example.com/doctors/${doctorId}/available-times`).then(res => res.json())
  );

  const handleSubmit = async (values) => {
    try {
      // TODO: Implement actual booking API call
      console.log('Booking appointment:', values);
      navigate('/patient/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Appointment
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Formik
          initialValues={{
            doctorId: doctorId || '',
            date: '',
            time: '',
            symptoms: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Doctor</InputLabel>
                    <Field
                      as={Select}
                      name="doctorId"
                      label="Doctor"
                      disabled
                    >
                      <MenuItem value={doctorId}>
                        {doctor?.name} - {doctor?.specialty}
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="date"
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.date && touched.date && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors.date}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Time</InputLabel>
                    <Field
                      as={Select}
                      name="time"
                      label="Time"
                    >
                      {availableTimes?.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="symptoms"
                    label="Symptoms"
                    multiline
                    rows={4}
                    fullWidth
                  />
                  {errors.symptoms && touched.symptoms && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors.symptoms}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking...' : 'Book Appointment'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AppointmentBooking;
