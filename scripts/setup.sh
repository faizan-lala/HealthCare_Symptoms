#!/bin/bash

# HealthTracker Setup Script
# This script helps set up the development environment

echo "🏥 HealthTracker Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional for local development)
if command -v mongod &> /dev/null; then
    if pgrep mongod > /dev/null; then
        echo "✅ MongoDB is running locally"
    else
        echo "⚠️  MongoDB is installed but not running. You can start it or use MongoDB Atlas."
    fi
else
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas for development."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
if [ -f "package.json" ]; then
    echo "Installing root dependencies..."
    npm install
fi

# Install server dependencies
echo "Installing server dependencies..."
cd server
if [ -f "package.json" ]; then
    npm install
    echo "✅ Server dependencies installed"
else
    echo "❌ Server package.json not found"
    exit 1
fi

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
if [ -f "package.json" ]; then
    npm install
    echo "✅ Client dependencies installed"
else
    echo "❌ Client package.json not found"
    exit 1
fi

cd ..

# Create environment files
echo ""
echo "🔧 Setting up environment files..."

# Server environment
if [ ! -f "server/.env" ]; then
    if [ -f "server/env.example" ]; then
        cp server/env.example server/.env
        echo "✅ Created server/.env from template"
        echo "⚠️  Please update server/.env with your actual values:"
        echo "   - MONGODB_URI (MongoDB connection string)"
        echo "   - JWT_SECRET (secure random string)"
    else
        echo "❌ server/env.example not found"
    fi
else
    echo "✅ server/.env already exists"
fi

# Client environment
if [ ! -f "client/.env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > client/.env
    echo "✅ Created client/.env"
else
    echo "✅ client/.env already exists"
fi

# Generate JWT secret if needed
if [ -f "server/.env" ]; then
    if grep -q "your_super_secret_jwt_key" server/.env; then
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "$(date +%s | sha256sum | base64 | head -c 32)")
        if command -v sed &> /dev/null; then
            sed -i.bak "s/your_super_secret_jwt_key_here_make_it_long_and_random/$JWT_SECRET/" server/.env
            rm -f server/.env.bak
            echo "✅ Generated secure JWT secret"
        else
            echo "⚠️  Please manually update JWT_SECRET in server/.env"
        fi
    fi
fi

# Setup complete
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your MongoDB URI"
echo "2. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/health"
echo ""
echo "📚 Documentation:"
echo "   README.md - Full documentation"
echo "   DEPLOYMENT.md - Deployment guide"
echo ""
echo "Happy coding! 🚀"
