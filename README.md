# HealthCare Symptoms (MERN + Tailwind)

A rules-based symptom logging and suggestions app with a real-time, interactive experience.

## Stack
- MongoDB, Express, React, Node.js
- Tailwind CSS, Headless UI
- React Query
- Socket.io (real-time updates)

## Getting Started

### Server
```
cd server
npm install
# copy .env.example to .env and fill values
npm run dev
```

### Client
```
cd client
npm install
# create .env and set VITE_API_URL (default http://localhost:5000/api)
npm run dev
```

## Real-time Events
- symptom:created | symptom:updated | symptom:deleted
- chatbot:suggestionSaved

Client auto-refreshes relevant queries using React Query invalidation.

## Build & Deploy
- Ensure environment variables are set in both `server` and `client`.
- Use a process manager (PM2) or a platform (Render/Heroku/Vercel API) to host the server.

## Security
- JWT auth, helmet, rate limiting.

## License
MIT
