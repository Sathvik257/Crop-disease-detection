# Smart Crop Disease Detection

An AI-powered web application for detecting and managing crop diseases using image analysis. Built with **React**, **TypeScript**, and **Supabase**.

🌐 **Live Demo**: [View Application](https://website-update-n8tv.bolt.host/)

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
   - [Core Features](#core-features)
   - [User Features](#user-features-authentication-required)
   - [Community Features](#community-features)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [Key Components](#key-components)
8. [API Services](#api-services)
9. [Edge Functions](#edge-functions)
10. [Database Security](#database-security)
11. [Performance Optimizations](#performance-optimizations)
12. [Development Scripts](#development-scripts)
13. [Browser Support](#browser-support)
14. [Contributing & Next Steps](#contributing--next-steps)
15. [Security Considerations](#security-considerations)
16. [License](#license)
17. [Disclaimer](#disclaimer)

---

## Overview

**Smart Crop Disease Detection** helps farmers and agricultural professionals identify crop diseases through image analysis, track treatments, and access a community-driven knowledge base. It combines AI-like disease prediction (mock or real ML), secure user authentication, weather and location-based risk detection, and a Supabase-backed database and storage system.

---

## Features

### Core Features
- **AI Disease Detection**: Upload crop leaf images and get instant predictions with confidence scores. Designed to plug in any ML model.
- **Disease Library**: Contains detailed information on symptoms, causes, affected parts, prevention, treatment, and environmental risk factors.
- **Search & Filter**: Find diseases by name, crop type, or symptom keywords.
- **Weather Integration**: Auto-detects user location (with fallback), uses reverse geocoding for readable place names, and displays weather-based risk levels.

### User Features (Authentication Required)
- **User Authentication** via Supabase Auth (email/password login)
- **Analysis History**: View all past detections.
- **Treatment Tracker**: Log treatments including type (chemical, organic, cultural, biological), products used, cost, field size, before/after images, and effectiveness rating.
- **Personal Dashboard**: Displays user statistics and summaries.
- **Profile Management**: Manage farm details, contact information, and location.

### Community Features
- **Forum System**: Discussion threads with replies.
- **Video Tutorials**: Educational content on disease management.
- **Disease Alerts**: Real-time regional outbreak notifications.

---

## Technology Stack

**Frontend:** React 18, TypeScript, Vite, CSS3 (responsive with animations), Lucide React Icons  
**Backend & Infra:** Supabase (PostgreSQL, Auth, Edge Functions, RLS), Supabase Edge Functions for disease analysis, Open-Meteo API for weather data, OpenStreetMap for reverse geocoding.

---

## Database Schema

| Table | Description |
|-------|--------------|
| `user_profiles` | Stores user & farm details |
| `user_analyses` | Records image analysis history |
| `disease_info` | Contains disease details |
| `solutions` | Treatment and prevention options |
| `treatment_logs` | Logs treatment activity |
| `forum_posts` | Forum topics |
| `forum_replies` | Forum replies |
| `disease_alerts` | Outbreak alerts |
| `video_tutorials` | Educational resources |
| `weather_data` | Weather and disease risk data |
| `analysis_history` | Historical view for analytics |

All tables have **Row Level Security (RLS)** enabled.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account and project

### Setup Steps
1. **Clone the Repository**  
   `git clone <repository-url>`  
   `cd smart-crop-disease-detection`

2. **Install Dependencies**  
   `npm install`

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory:  


4. **Run Database Migrations**  
`supabase db push`

5. **Start the Development Server**  
`npm run dev`  
Visit: [http://localhost:5173](http://localhost:5173)

6. **Build for Production**  
`npm run build`  
The output will be available in the `dist/` directory.

---

## Project Structure
smart-crop-disease-detection/
├── src/
│ ├── components/
│ │ ├── Auth.tsx
│ │ ├── Dashboard.tsx
│ │ ├── DiseaseLibrary.tsx
│ │ ├── ImageUpload.tsx
│ │ ├── Results.tsx
│ │ ├── Solutions.tsx
│ │ ├── Statistics.tsx
│ │ ├── TreatmentTracker.tsx
│ │ ├── WeatherWidget.tsx
│ │ └── ...
│ ├── contexts/
│ │ └── AuthContext.tsx
│ ├── services/
│ │ └── api.ts
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── supabase/
│ ├── functions/
│ │ └── analyze-crop/
│ └── migrations/
├── public/
├── dist/
└── package.json


---

## Key Components

- **Auth** – Sign in/out and manage protected routes.  
- **ImageUpload** – Drag and drop or select image for analysis.  
- **Results** – Display prediction confidence and disease info.  
- **TreatmentTracker** – Log and monitor treatment effectiveness.  
- **WeatherWidget** – Show real-time weather and risk levels.

---

## API Services

Located in `src/services/api.ts`:
- `analyzeCropDisease(image: File)`
- `saveAnalysis(payload)`
- `getAnalysisHistory(userId)`
- `getDiseaseInfo(id)`
- `getAllDiseases()`
- `searchDiseases(query)`
- `getSolutions(diseaseId)`

---

## Edge Functions

### `analyze-crop`
- Located at `supabase/functions/analyze-crop/`
- Handles image uploads via POST
- Returns mock predictions with confidence scores
- Includes CORS headers
- Can integrate with a trained ML model later

---

## Database Security

- Row Level Security (RLS) on all user tables  
- User-specific data isolation  
- Foreign key constraints for data integrity  
- Edge Functions can safely use Supabase service role for privileged operations

---

## Performance Optimizations

- Indexed foreign keys for fast joins  
- Lazy-loaded React components  
- Weather data caching for reduced API calls  
- Supabase definer functions for optimized RLS policies

---

## Development Scripts

- `npm run dev` → Start development server  
- `npm run build` → Build production bundle  
- `npm run preview` → Preview production build  
- `npm run lint` → Lint the code  
- `npm run typecheck` → Check TypeScript types

---

## Browser Support

- ✅ Chrome / Edge (latest)  
- ✅ Firefox (latest)  
- ✅ Safari (latest)  
- ✅ Mobile (iOS Safari, Chrome Mobile)

---

## Contributing & Next Steps

Potential future improvements:
- Integrate a real ML model (TensorFlow / FastAPI / Replicate)
- Add Supabase Storage for storing uploaded images
- Implement email or push-based disease alerts
- Expand the disease dataset
- Add multilingual support
- Create an admin dashboard for managing disease data

---

## Security Considerations

- Do not commit `.env` files to source control  
- Keep Row Level Security enabled  
- Validate user inputs both client-side and server-side  
- Configure CORS for only trusted domains  

---

## License

This project is for **educational purposes only**.

---

## Disclaimer

This application provides **preliminary disease identification** and treatment suggestions.  
For accurate agricultural guidance, please consult a **qualified plant pathologist or agricultural expert** before applying treatments.

---

