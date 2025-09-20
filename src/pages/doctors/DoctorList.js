import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Rating,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  FilterList,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { mockDoctors } from '../../services/mockData';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const DoctorList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const doctorsPerPage = 6;

  // Get unique specialties for filter dropdown
  const specialties = [...new Set(mockDoctors.map(doctor => doctor.specialty))];

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with mock data
        setTimeout(() => {
          setDoctors(mockDoctors);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...doctors];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        doctor =>
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialty.toLowerCase().includes(searchLower) ||
          (doctor.bio && doctor.bio.toLowerCase().includes(searchLower))
      );
    }

    // Apply specialty filter
    if (specialty) {
      result = result.filter(doctor => doctor.specialty === specialty);
    }

    // Apply availability filter
    if (availability === 'today') {
      result = result.filter(doctor => 
        doctor.availableSlots.some(slot => isToday(parseISO(slot)))
      );
    } else if (availability === 'tomorrow') {
      result = result.filter(doctor =>
        doctor.availableSlots.some(slot => isTomorrow(parseISO(slot)))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'name':
          return a.name.localeCompare(b.name);
        default: // 'relevance'
          return 0; // Default sorting (as returned by the API)
      }
    });

    setFilteredDoctors(result);
    
    // Update URL with current filters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (specialty) params.set('specialty', specialty);
    if (availability) params.set('availability', availability);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (page > 1) params.set('page', page);
    
    setSearchParams(params);
  }, [doctors, searchTerm, specialty, availability, sortBy, page, setSearchParams]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite status
  const toggleFavorite = (doctorId) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor.id === doctorId
          ? { ...doctor, isFavorite: !doctor.isFavorite }
          : doctor
      )
    );
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'EEE, MMM d, h:mm a');
  };

  // Calculate pagination
  const indexOfLastDoctor = page * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton width="60%" height={24} />
              <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
              <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Find the Right Doctor for You
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Book appointments with top specialists in your area
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search doctors, specialties, or conditions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth>
                <InputLabel id="specialty-label">Specialty</InputLabel>
                <Select
                  labelId="specialty-label"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  label="Specialty"
                >
                  <MenuItem value="">All Specialties</MenuItem>
                  {specialties.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth>
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  label="Availability"
                >
                  <MenuItem value="">Any Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="experience">Most Experienced</MenuItem>
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size={isMobile ? 'medium' : 'large'}
                sx={{ height: '56px' }}
              >
                {isMobile ? 'Go' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {specialty && (
              <Chip
                label={`Specialty: ${specialty}`}
                onDelete={() => setSpecialty('')}
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {availability && (
              <Chip
                label={`Available: ${availability}`}
                onDelete={() => setAvailability('')}
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        </Box>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No doctors found matching your criteria
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => {
                setSearchTerm('');
                setSpecialty('');
                setAvailability('');
                setSortBy('relevance');
              }}
              sx={{ mt: 2 }}
            >
              Clear all filters
            </Button>
          </Box>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              component={Grid}
              container
              spacing={3}
            >
              <AnimatePresence>
                {currentDoctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                    <motion.div
                      variants={fadeInUp}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 6,
                          },
                          position: 'relative',
                          overflow: 'visible',
                        }}
                      >
                        <IconButton
                          aria-label="add to favorites"
                          onClick={() => toggleFavorite(doctor.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: 'background.paper',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          {doctor.isFavorite ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        
                        <CardMedia
                          component="img"
                          height="200"
                          image={doctor.avatar}
                          alt={doctor.name}
                          sx={{
                            objectFit: 'cover',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                          }}
                        />
                        
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, pr: 1 }}>
                              {doctor.name}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <StarIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {doctor.rating} ({doctor.reviewCount})
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Chip 
                            label={doctor.specialty} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mb: 1.5, fontWeight: 500 }}
                          />
                          
                          <Box display="flex" alignItems="center" mb={1.5}>
                            <LocationIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {doctor.location}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" mb={2}>
                            <WorkIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {doctor.experience} years experience
                            </Typography>
                          </Box>
                          
                          <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Next Available:
                            </Typography>
                            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                              {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                                doctor.availableSlots.slice(0, 2).map((slot, index) => (
                                  <Chip
                                    key={index}
                                    label={formatDate(slot)}
                                    size="small"
                                    variant="outlined"
                                    icon={<TimeIcon fontSize="small" />}
                                    sx={{ 
                                      '& .MuiChip-icon': {
                                        color: 'primary.main',
                                        marginLeft: '4px',
                                      },
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No available slots
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                            disabled={!doctor.availableSlots || doctor.availableSlots.length === 0}
                          >
                            View Profile
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  siblingCount={isMobile ? 0 : 1}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default DoctorList;
