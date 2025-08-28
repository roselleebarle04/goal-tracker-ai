#!/bin/bash

# Goal Tracker - Docker Compose Startup Script

echo "🎯 Starting Goal Tracker Application..."
echo ""

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down

# Build and start the application
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Goal Tracker is now running!"
    echo ""
    echo "📱 Frontend: http://localhost:3001"
    echo "🔧 Backend API: http://localhost:8001"
    echo "🗄️  Admin Panel: http://localhost:8001/admin"
    echo ""
    echo "🛑 To stop the application, run: docker-compose down"
    echo "📊 To view logs, run: docker-compose logs -f"
    echo ""
else
    echo ""
    echo "❌ Failed to start services. Check the logs:"
    echo "docker-compose logs"
    exit 1
fi