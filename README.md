# Goal Tracker - Full-Stack Web Application

A complete goal tracking web application built with Django (backend) and Next.js (frontend) that helps users manage and achieve their goals through daily habits tracking, progress monitoring, and visual inspiration boards.

## Features

### Core Functionality
- 🎯 **Goal Management**: Create, edit, and track big goals with categories and deadlines
- ✅ **Daily Habits**: Build consistent habits that align with your goals
- 📊 **Progress Dashboard**: Visual overview of your goals and habit completion rates
- 🖼️ **Vision Board**: Visual inspiration with image uploads and auto-generated content
- 📈 **Export Functionality**: Export your goals and progress data as CSV

### Technical Features
- 🔐 **Authentication**: Google OAuth integration and custom user management
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Cozy UI**: Warm, minimal color scheme for distraction-free experience
- ⚡ **Real-time Updates**: Live habit tracking and progress updates
- 🔒 **Secure API**: Django REST framework with proper authentication

## Tech Stack

### Backend
- **Django 5.1.4** - Web framework
- **Django REST Framework 3.15.2** - API development
- **Django Allauth 65.2.0** - Authentication and OAuth
- **SQLite** - Database (development)
- **Python 3.x** - Programming language

### Frontend
- **Next.js 15.5.2** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 3.4.0** - Styling
- **React Hook Form 7.48.2** - Form management
- **Axios 1.6.2** - API client
- **React Hot Toast 2.4.1** - Notifications

## Project Structure

```
goal-tracker-ai/
├── backend/                    # Django API backend
│   ├── goaltracker/           # Main Django project
│   ├── accounts/              # User authentication app
│   ├── goals/                 # Goals and habits app
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js 13+ app directory
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   └── lib/              # Utilities and API client
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
└── README.md
```

## Quick Start

### 🐳 Docker Setup (Recommended)

The easiest way to run the application is using Docker:

1. **Prerequisites**: Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8001
   - Admin Panel: http://localhost:8001/admin

That's it! 🎉 See [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed Docker configuration.

### Manual Setup

If you prefer to run without Docker:

#### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn
- PostgreSQL (optional, SQLite used by default)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
   GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
   ```

5. **Run database migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/me/` - Get current user profile
- `PATCH /api/auth/profile/` - Update user profile
- `POST /api/auth/logout/` - User logout

### Goals
- `GET /api/goals/` - List user goals (with filtering)
- `POST /api/goals/` - Create new goal
- `GET /api/goals/{id}/` - Get specific goal
- `PATCH /api/goals/{id}/` - Update goal
- `DELETE /api/goals/{id}/` - Delete goal
- `GET /api/goals/export/csv/` - Export goals as CSV

### Habits
- `GET /api/goals/habits/` - List user habits
- `POST /api/goals/habits/` - Create new habit
- `GET /api/goals/habits/{id}/` - Get specific habit
- `PATCH /api/goals/habits/{id}/` - Update habit
- `DELETE /api/goals/habits/{id}/` - Delete habit
- `GET /api/goals/today-habits/` - Get today's habits
- `POST /api/goals/habit-entries/{id}/toggle/` - Toggle habit completion

### Dashboard
- `GET /api/goals/dashboard/stats/` - Get dashboard statistics

### Vision Board
- `GET /api/goals/vision-board/` - List vision board images
- `POST /api/goals/vision-board/` - Upload new image
- `DELETE /api/goals/vision-board/{id}/` - Delete image

## Usage Guide

### 1. Getting Started
1. Visit `http://localhost:3000`
2. Create an account or sign in
3. Complete your profile setup

### 2. Creating Goals
1. Go to the Goals page
2. Click "New Goal"
3. Fill in goal details:
   - Title and description
   - Category (Career, Health, Finance, etc.)
   - Goal type (Short-term or Long-term)
   - Target date
   - Initial progress

### 3. Setting Up Habits
1. Go to the Habits page
2. Click "New Habit"
3. Create habits that support your goals:
   - Link to specific goals (optional)
   - Set frequency (Daily, Weekly, Monthly)
   - Add descriptions and notes

### 4. Daily Tracking
1. Check the Dashboard for today's habits
2. Click checkboxes to mark habits complete
3. View progress statistics and completion rates
4. Monitor overdue goals and weekly trends

### 5. Vision Board
1. Go to the Vision Board page
2. Upload inspirational images
3. Associate images with specific goals
4. Create visual motivation for your objectives

### 6. Exporting Data
1. Go to the Goals page
2. Use the export functionality to download CSV files
3. Analyze your progress in external tools

## Google OAuth Setup

To enable Google authentication:

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**:
   - Navigate to APIs & Services > Library
   - Search for and enable "Google+ API"

3. **Create OAuth Credentials**:
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Set authorized redirect URIs:
     - `http://localhost:8000/accounts/google/login/callback/`

4. **Update Environment Variables**:
   - Add your Client ID and Client Secret to the backend `.env` file

## Deployment

### Backend Deployment
1. Update `ALLOWED_HOSTS` in Django settings
2. Set `DEBUG=False` for production
3. Configure production database (PostgreSQL recommended)
4. Set up static file serving
5. Deploy to your preferred platform (Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Update API URLs in environment variables
2. Run `npm run build` to create production build
3. Deploy to Vercel, Netlify, or your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:
- Create an issue in the GitHub repository
- Check the documentation for troubleshooting tips
- Review the API documentation for integration details

## Future Enhancements

- 📱 Mobile app (React Native)
- 🤖 AI-powered goal suggestions
- 📊 Advanced analytics and reporting
- 🎯 Goal templates and presets
- 👥 Social features and goal sharing
- 📅 Calendar integration
- 🎨 Custom themes and personalization
- 📧 Email reminders and notifications