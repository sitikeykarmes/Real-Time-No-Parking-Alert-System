#!/bin/bash

echo "🚀 Starting Parking Violation App (Expo) Development..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $EXPO_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting backend server..."
cd backend
source venv/bin/activate 2>/dev/null || echo "Virtual environment not found, using system Python"
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Expo app
echo "📱 Starting Expo development server..."
cd ParkingViolationApp
expo start &
EXPO_PID=$!

echo "✅ Development servers started!"
echo "📍 Backend: http://localhost:5000"
echo "📱 Expo: Scan QR code with Expo Go app"
echo "🌐 Expo DevTools: http://localhost:19002"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait