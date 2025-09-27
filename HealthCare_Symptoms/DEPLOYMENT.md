# Deployment Guide 🚀

This guide covers deploying the HealthTracker application to various platforms.

## Quick Deployment Options

### Option 1: Vercel + Render (Recommended)
- **Frontend**: Vercel (Free tier available)
- **Backend**: Render (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

### Option 2: Netlify + Heroku
- **Frontend**: Netlify (Free tier available)
- **Backend**: Heroku (Free tier discontinued, paid plans available)
- **Database**: MongoDB Atlas (Free tier available)

### Option 3: Full Cloud (AWS/GCP/Azure)
- **Frontend**: AWS S3 + CloudFront / GCP Storage + CDN
- **Backend**: AWS EC2/ECS / GCP Compute Engine / Azure App Service
- **Database**: MongoDB Atlas or cloud-managed MongoDB

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create Cluster
1. Click "Build a Database"
2. Choose "FREE" shared cluster
3. Select your preferred cloud provider and region
4. Click "Create Cluster"

### 3. Configure Security
```bash
# Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Or add your specific IP addresses for production

# Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create username and password
4. Grant "Read and write to any database" permissions
```

### 4. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

## Frontend Deployment

### Vercel Deployment

#### Via GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure build settings:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy!

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# Set up and deploy? Y
# Which scope? (select your account)
# Link to existing project? N
# What's your project's name? healthcare-symptoms-client
# In which directory is your code located? ./
```

### Netlify Deployment

#### Via Git Integration
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/dist
   ```
5. Add environment variables in Site Settings > Environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd client
npm run build

# Deploy to Netlify
netlify deploy

# For production deployment
netlify deploy --prod
```

## Backend Deployment

### Render Deployment (Recommended)

#### Via GitHub Integration
1. Go to [Render](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   ```
   Name: healthcare-symptoms-api
   Environment: Node
   Region: Oregon (US West) or your preferred region
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

5. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_symptoms
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend-domain.vercel.app
   PORT=5000
   ```

6. Deploy!

#### Manual Deployment
```bash
# Create render.yaml in root directory
# See render.yaml configuration below

# Commit and push to trigger deployment
git add .
git commit -m "Deploy to Render"
git push origin main
```

#### render.yaml Configuration
```yaml
services:
  - type: web
    name: healthcare-symptoms-api
    env: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRE
        value: 30d
      - key: CLIENT_URL
        sync: false
```

### Heroku Deployment

#### Prerequisites
```bash
# Install Heroku CLI
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

#### Deploy Backend
```bash
# Navigate to project root
cd /path/to/healthcare-symptoms

# Create Heroku app
heroku create your-app-name-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_super_secret_jwt_key"
heroku config:set JWT_EXPIRE=30d
heroku config:set CLIENT_URL="https://your-frontend-domain.vercel.app"

# Add buildpack for subdirectory
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack

# Set subdirectory
heroku config:set PROJECT_PATH=server

# Deploy
git subtree push --prefix server heroku main

# Or create a separate git repository for the server
cd server
git init
git add .
git commit -m "Initial commit"
git remote add heroku https://git.heroku.com/your-app-name-api.git
git push heroku main
```

## Environment Variables Reference

### Backend Environment Variables
```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_symptoms
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CLIENT_URL=https://your-frontend-domain.vercel.app

# Optional
NODE_ENV=production
PORT=5000
JWT_EXPIRE=30d
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables
```bash
# Required
VITE_API_URL=https://your-backend-domain.onrender.com/api

# Optional
VITE_APP_NAME=HealthTracker
VITE_APP_VERSION=1.0.0
```

## SSL/HTTPS Configuration

### Automatic SSL (Vercel/Netlify/Render)
Most modern deployment platforms provide automatic SSL certificates. No additional configuration required.

### Custom Domain Setup

#### Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

#### Netlify
1. Go to Site Settings > Domain management
2. Add custom domain
3. Configure DNS records

#### Render
1. Go to your service dashboard
2. Click "Settings" > "Custom Domains"
3. Add your domain and configure DNS

## Performance Optimization

### Frontend Optimizations
```bash
# Enable gzip compression (automatic on Vercel/Netlify)
# Optimize images and assets
# Enable browser caching
# Use CDN for static assets
```

### Backend Optimizations
```bash
# Enable compression middleware (already included)
# Use MongoDB indexing (already configured)
# Implement Redis caching (optional)
# Enable rate limiting (already included)
```

## Monitoring and Logging

### Frontend Monitoring
```bash
# Vercel Analytics
# Google Analytics
# Sentry for error tracking
```

### Backend Monitoring
```bash
# Render provides basic monitoring
# Add external services:
# - New Relic
# - DataDog
# - LogRocket
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version  # Should be 16+
```

#### Database Connection Issues
```bash
# Verify MongoDB URI format
mongodb+srv://username:password@cluster.mongodb.net/database

# Check IP whitelist in MongoDB Atlas
# Ensure password doesn't contain special characters
```

#### CORS Errors
```bash
# Verify CLIENT_URL matches your frontend domain exactly
CLIENT_URL=https://your-app.vercel.app  # No trailing slash

# Check that frontend is making requests to correct API URL
VITE_API_URL=https://your-api.onrender.com/api
```

#### JWT Token Issues
```bash
# Ensure JWT_SECRET is at least 32 characters
# Verify JWT_SECRET is consistent across deployments
# Check token expiration settings
```

### Health Checks

#### Backend Health Check
```bash
curl https://your-api-domain.com/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

#### Frontend Health Check
```bash
curl https://your-frontend-domain.com
# Should return HTML content
```

## Backup and Recovery

### Database Backup
```bash
# MongoDB Atlas provides automatic backups
# For manual backups:
mongodump --uri="your_mongodb_uri" --out=backup/
```

### Application Backup
```bash
# Git repository serves as code backup
# Environment variables should be documented separately
# User uploads (if any) should be backed up separately
```

## Security Checklist

- [ ] Environment variables are not committed to version control
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive information

## Production Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Environment variables are configured
- [ ] Database is set up and accessible
- [ ] API endpoints are tested
- [ ] Frontend builds successfully

### Post-deployment
- [ ] Health checks pass
- [ ] Authentication works
- [ ] Database operations work
- [ ] Frontend loads correctly
- [ ] API responses are correct
- [ ] Error handling works
- [ ] Performance is acceptable

---

Need help with deployment? Check our [support documentation](README.md#support) or create an issue on GitHub.
