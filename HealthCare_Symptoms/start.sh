#!/bin/bash

echo "🏥 Starting HealthTracker Development Servers..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "Installing server dependencies..."
cd server && npm install

echo "Installing client dependencies..."
cd ../client && npm install

cd ..

echo
echo "🚀 Starting development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo

# Start both servers using the main npm script
npm run dev
