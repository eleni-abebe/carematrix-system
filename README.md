# Hospital Management System

A comprehensive hospital management system built with React and Material-UI.

## Features

- User Authentication (Login/Register)
- Doctor Management
- Appointment Scheduling
- Patient Dashboard
- Admin Dashboard
- Responsive Design

## Tech Stack

- React 18
- Material-UI v5
- React Router v6
- React Query v3
- Formik + Yup for forms
- React Hot Toast for notifications

## Prerequisites

- Node.js 16+ and npm/yarn
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-mg.git
   cd hospital-mg
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables (see `.env.example`)

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from create-react-app

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── hooks/         # Custom hooks
  ├── utils/         # Utility functions
  ├── contexts/      # React contexts
  ├── assets/        # Static assets
  └── styles/        # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
