# Smart Crop Disease Detection

An AI-powered web application for detecting and managing crop diseases using image analysis. Built with React, TypeScript, and Supabase.

🌐 **Live Demo**: [View Application](https://your-deployment-url-here.netlify.app)

## Overview

Smart Crop Disease Detection is a comprehensive platform that helps farmers and agricultural professionals identify crop diseases through image analysis, track treatments, and access a knowledge base of disease information. The application combines AI-powered disease detection with user management, historical tracking, and community features.

## Features

### Core Features
- **AI Disease Detection**: Upload crop leaf images for instant disease identification with confidence scores
- **Disease Library**: Comprehensive database of crop diseases with detailed information including:
  - Symptoms and visual indicators
  - Causes and affected plant parts
  - Prevention strategies
  - Treatment recommendations
  - Optimal conditions for disease development
- **Search & Filter**: Find diseases by name, crop type, or symptoms
- **Weather Integration**: Displays current conditions with disease risk factors
  - Automatic location detection using browser geolocation
  - Reverse geocoding to show city/region name
  - Graceful fallback if location access is denied

### User Features (Authentication Required)
- **User Authentication**: Secure sign-up and sign-in with email/password
- **Analysis History**: Track all your disease detections over time
- **Treatment Tracker**: Log and monitor treatment applications including:
  - Treatment types (chemical, organic, cultural, biological)
  - Products used and costs
  - Application dates and field size
  - Before/after images
  - Effectiveness ratings
- **Personal Dashboard**: View statistics and manage your analysis history
- **User Profiles**: Manage personal information including farm name, location, and contact details

### Community Features
- **Forum System**: Discussion boards for sharing experiences and solutions
- **Video Tutorials**: Educational content about disease management
- **Disease Alerts**: Regional disease outbreak notifications

## Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with animations and responsive design
- **Lucide React**: Beautiful icon library

### Backend & Database
- **Supabase**: Complete backend solution providing:
  - PostgreSQL database with Row Level Security (RLS)
  - Authentication and user management
  - Edge Functions for serverless computing
  - Real-time subscriptions
- **Edge Functions**: Serverless functions for image analysis

### Database Schema

The application uses the following tables:

1. **user_profiles**: User information and farm details
2. **user_analyses**: Disease detection history
3. **disease_info**: Comprehensive disease information
4. **solutions**: Treatment and prevention solutions
5. **treatment_logs**: Treatment application tracking
6. **forum_posts**: Community discussion posts
7. **forum_replies**: Replies to forum posts
8. **disease_alerts**: Regional disease outbreak alerts
9. **video_tutorials**: Educational video content
10. **weather_data**: Weather information and risk factors
11. **analysis_history**: Historical analysis data

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-crop-disease-detection
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
All migrations are located in `supabase/migrations/`. They include:
- User authentication and profile setup
- Disease information tables
- Treatment tracking system
- Forum and community features
- RLS policies for data security

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Project Structure

```
smart-crop-disease-detection/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.tsx         # Authentication component
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── DiseaseLibrary.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Results.tsx
│   │   ├── Solutions.tsx
│   │   ├── Statistics.tsx
│   │   ├── TreatmentTracker.tsx
│   │   ├── WeatherWidget.tsx
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── services/            # API services
│   │   └── api.ts           # Supabase client and API calls
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── functions/           # Edge functions
│   │   └── analyze-crop/    # Image analysis function
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── dist/                    # Production build
└── package.json
```

## Key Components

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes and user-specific data
- User profiles with farm information

### Disease Detection
- Image upload with drag-and-drop support
- Edge function processing for disease analysis
- Confidence score display
- Detailed disease information retrieval

### Treatment Tracking
- Comprehensive treatment logging
- Cost and effectiveness tracking
- Before/after image comparison
- Multiple treatment types support

### Location & Weather
- Browser-based geolocation for automatic location detection
- OpenStreetMap reverse geocoding for location names
- Real-time weather data from Open-Meteo API
- Displays current temperature, humidity, and rainfall
- Automatic disease risk assessment based on weather conditions
- Caches location data for 5 minutes to reduce API calls
- Fallback handling when location access is denied

### Data Security
- Row Level Security (RLS) policies on all tables
- User data isolation
- Secure authentication flows
- Foreign key constraints with proper indexing

## API Services

The application includes several API functions in `src/services/api.ts`:

- `analyzeCropDisease()`: Send images for disease analysis
- `saveAnalysis()`: Store analysis results
- `getAnalysisHistory()`: Retrieve user's analysis history
- `getDiseaseInfo()`: Get detailed disease information
- `getAllDiseases()`: Fetch complete disease library
- `searchDiseases()`: Search diseases by query
- `getSolutions()`: Get treatment solutions for a disease

## Edge Functions

### analyze-crop
Located in `supabase/functions/analyze-crop/`, this function:
- Accepts image uploads via POST
- Returns disease predictions with confidence scores
- Includes CORS headers for frontend integration
- Currently uses mock data (ready for ML model integration)

## Database Security

All tables implement Row Level Security (RLS) with policies that:
- Restrict data access to authenticated users
- Ensure users can only access their own data
- Prevent unauthorized modifications
- Include proper foreign key relationships and indexes

## Performance Optimizations

- Indexes on all foreign keys for optimal JOIN performance
- Security definer functions for efficient RLS checks
- Optimized database queries with proper filtering
- Lazy loading of components
- CSS animations using GPU acceleration

## Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run typecheck`: Check TypeScript types

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is an educational proof of concept. For production use, consider:
- Integrating a real machine learning model for disease detection
- Adding image storage in Supabase Storage
- Adding email notifications for disease alerts
- Expanding the disease library with more crops
- Adding multi-language support

## Security Considerations

- Never commit `.env` files to version control
- All sensitive operations use Row Level Security
- Authentication tokens are handled securely by Supabase
- CORS is properly configured for edge functions
- Input validation on all user-submitted data

## License

This project is for educational purposes.

## Disclaimer

This application is a proof of concept for educational purposes. For production agricultural use, please validate all disease identification results with qualified agricultural experts or plant pathologists. The AI predictions should be used as a preliminary diagnostic tool, not as a replacement for professional agricultural consultation.

## Support

For issues, questions, or contributions, please refer to the project repository.

---

Built with React, TypeScript, and Supabase
