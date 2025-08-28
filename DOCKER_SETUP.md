# Docker Setup Guide

This guide will help you run the Goal Tracker application using Docker and Docker Compose with a single command.

## Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### 1. Clone and Navigate to Project
```bash
cd goal-tracker-ai
```

### 2. Start the Application
```bash
docker-compose up --build
```

That's it! The application will start with:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **Admin Panel**: http://localhost:8001/admin
- **PostgreSQL Database**: Running on port 5432

## Alternative Startup Methods

### Using the Startup Script (macOS/Linux)
```bash
chmod +x start.sh
./start.sh
```

### Manual Docker Commands
```bash
# Build and start in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Container Architecture

The setup includes 3 containers:

### 1. PostgreSQL Database (`db`)
- **Image**: postgres:15
- **Port**: 5432
- **Database**: goaltracker
- **Username**: goaltracker
- **Password**: goaltracker123

### 2. Django Backend (`backend`)
- **Port**: 8001
- **Built from**: `./backend/Dockerfile`
- **Features**:
  - Automatic migrations
  - Static file collection
  - Health checks
  - Volume mounting for development

### 3. Next.js Frontend (`frontend`)
- **Port**: 3001
- **Built from**: `./frontend/Dockerfile`
- **Features**:
  - Hot reloading
  - Volume mounting for development
  - Optimized for development mode

## Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

### Backend
```env
DEBUG=True
SECRET_KEY=django-insecure-docker-secret-key-change-in-production
DATABASE_URL=postgresql://goaltracker:goaltracker123@db:5432/goaltracker
ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NODE_ENV=development
```

## Development Workflow

### Making Changes
1. **Backend Changes**: Edit files in `./backend/` - the container will restart automatically
2. **Frontend Changes**: Edit files in `./frontend/` - hot reloading is enabled
3. **Database Changes**: Run migrations with: `docker-compose exec backend python manage.py migrate`

### Useful Commands

```bash
# View running containers
docker-compose ps

# Access backend shell
docker-compose exec backend python manage.py shell

# Access database
docker-compose exec db psql -U goaltracker -d goaltracker

# Create Django superuser
docker-compose exec backend python manage.py createsuperuser

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Restart a specific service
docker-compose restart backend

# Rebuild a specific service
docker-compose up --build backend
```

### Database Management

```bash
# Run migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Load sample data (if you create fixtures)
docker-compose exec backend python manage.py loaddata sample_data.json

# Backup database
docker-compose exec db pg_dump -U goaltracker goaltracker > backup.sql

# Restore database
docker-compose exec -T db psql -U goaltracker -d goaltracker < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :8001
   lsof -i :5432
   
   # Kill processes or change ports in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Restart the database service
   docker-compose restart db
   
   # Check database logs
   docker-compose logs db
   ```

3. **Frontend Not Loading**
   ```bash
   # Check if backend is running
   curl http://localhost:8001/admin/
   
   # Restart frontend
   docker-compose restart frontend
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Clean Reset

If you encounter persistent issues:

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild everything
docker-compose up --build
```

## Production Deployment

For production deployment, you'll need to:

1. **Update Environment Variables**:
   - Set `DEBUG=False`
   - Use a strong `SECRET_KEY`
   - Configure proper database credentials
   - Set correct `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

2. **Use Production Database**:
   - Consider using a managed PostgreSQL service
   - Update `DATABASE_URL` accordingly

3. **Configure HTTPS**:
   - Add a reverse proxy (nginx)
   - Configure SSL certificates

4. **Security**:
   - Use Docker secrets for sensitive data
   - Run containers as non-root users
   - Implement proper firewall rules

## Getting Started with the Application

Once the containers are running:

1. **Visit**: http://localhost:3001
2. **Register**: Create a new account
3. **Explore**: 
   - Create your first goal
   - Add daily habits
   - Track your progress on the dashboard
   - Upload images to your vision board

## Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Ensure all containers are running: `docker-compose ps`
3. Verify port availability: `netstat -tlnp | grep :3001`
4. Check the Docker and Docker Compose documentation

## Next Steps

- Set up Google OAuth credentials for social login
- Customize the application colors and branding
- Add sample data for testing
- Set up CI/CD pipelines for automated deployment