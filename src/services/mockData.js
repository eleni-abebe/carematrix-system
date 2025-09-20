// Mock data for development and testing

// Generate random date within the next 7 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 7));
  date.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date;
};

// Generate 3 random available time slots
const generateAvailableSlots = () => {
  const slots = [];
  for (let i = 0; i < 3; i++) {
    slots.push(getRandomDate().toISOString());
  }
  return slots.sort((a, b) => new Date(a) - new Date(b));
};

// Mock doctors data
export const mockDoctors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialty: 'Cardiology',
    experience: 12,
    rating: 4.8,
    reviewCount: 128,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Main Hospital, Floor 3',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Dr. Johnson is a board-certified cardiologist with over 10 years of experience in treating heart conditions. She specializes in interventional cardiology and preventive care.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialty: 'Neurology',
    experience: 8,
    rating: 4.9,
    reviewCount: 215,
    isFavorite: true,
    availableSlots: generateAvailableSlots(),
    location: 'Neurology Center, Building B',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Dr. Chen is a neurologist specializing in the treatment of migraines and movement disorders. He is known for his patient-centered approach and innovative treatments.'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    specialty: 'Pediatrics',
    experience: 6,
    rating: 4.7,
    reviewCount: 176,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Children\'s Wing, Floor 1',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Dr. Rodriguez is a pediatrician with a special interest in childhood development and nutrition. She is fluent in both English and Spanish.'
  },
  {
    id: '4',
    name: 'David Kim',
    specialty: 'Orthopedics',
    experience: 15,
    rating: 4.9,
    reviewCount: 342,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Orthopedic Center, Floor 2',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Dr. Kim is an orthopedic surgeon specializing in sports medicine and joint replacement. He has helped numerous athletes return to peak performance.'
  },
  {
    id: '5',
    name: 'Priya Patel',
    specialty: 'Dermatology',
    experience: 7,
    rating: 4.8,
    reviewCount: 198,
    isFavorite: true,
    availableSlots: generateAvailableSlots(),
    location: 'Dermatology Clinic, Building C',
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    bio: 'Dr. Patel is a dermatologist with expertise in medical and cosmetic dermatology. She is passionate about skin cancer prevention and early detection.'
  },
  {
    id: '6',
    name: 'James Wilson',
    specialty: 'Ophthalmology',
    experience: 11,
    rating: 4.7,
    reviewCount: 231,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Eye Center, Floor 1',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    bio: 'Dr. Wilson is an ophthalmologist specializing in cataract and refractive surgery. He has performed thousands of successful vision correction procedures.'
  },
  {
    id: '7',
    name: 'Lisa Wong',
    specialty: 'Gynecology',
    experience: 9,
    rating: 4.9,
    reviewCount: 287,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Women\'s Health Center, Floor 2',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    bio: 'Dr. Wong is a gynecologist providing comprehensive women\'s health services. She is particularly focused on preventive care and patient education.'
  },
  {
    id: '8',
    name: 'Robert Taylor',
    specialty: 'Urology',
    experience: 14,
    rating: 4.8,
    reviewCount: 203,
    isFavorite: false,
    availableSlots: generateAvailableSlots(),
    location: 'Urology Department, Floor 3',
    avatar: 'https://randomuser.me/api/portraits/men/53.jpg',
    bio: 'Dr. Taylor is a urologist with extensive experience in minimally invasive procedures. He is dedicated to providing compassionate care for urological conditions.'
  },
];

// Mock function to simulate API calls
export const mockApi = {
  getDoctors: (filters = {}) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        let results = [...mockDoctors];
        
        // Apply filters
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          results = results.filter(
            doctor => 
              doctor.name.toLowerCase().includes(searchTerm) ||
              doctor.specialty.toLowerCase().includes(searchTerm) ||
              doctor.bio.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.specialty && filters.specialty !== 'all') {
          results = results.filter(
            doctor => doctor.specialty === filters.specialty
          );
        }
        
        if (filters.available !== undefined) {
          results = results.filter(
            doctor => doctor.availableSlots && doctor.availableSlots.length > 0
          );
        }
        
        // Apply sorting
        if (filters.sort) {
          switch (filters.sort) {
            case 'rating':
              results.sort((a, b) => b.rating - a.rating);
              break;
            case 'experience':
              results.sort((a, b) => b.experience - a.experience);
              break;
            case 'availability':
              results.sort((a, b) => {
                const aDate = a.availableSlots && a.availableSlots.length > 0 ? new Date(a.availableSlots[0]) : new Date(0);
                const bDate = b.availableSlots && b.availableSlots.length > 0 ? new Date(b.availableSlots[0]) : new Date(0);
                return aDate - bDate;
              });
              break;
            default: // 'recommended' - sort by rating and experience
              results.sort((a, b) => {
                const scoreA = (a.rating * 10) + (a.experience * 0.5);
                const scoreB = (b.rating * 10) + (b.experience * 0.5);
                return scoreB - scoreA;
              });
          }
        }
        
        resolve({
          data: results,
          total: results.length,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: Math.ceil(results.length / (filters.limit || 10))
        });
      }, 500); // 500ms delay to simulate network
    });
  },
  
  toggleFavorite: (doctorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctor = mockDoctors.find(d => d.id === doctorId);
        if (doctor) {
          doctor.isFavorite = !doctor.isFavorite;
          resolve({ success: true, isFavorite: doctor.isFavorite });
        } else {
          resolve({ success: false, error: 'Doctor not found' });
        }
      }, 300);
    });
  }
};

export default mockApi;
