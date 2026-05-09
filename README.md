# Explore Sri Lanka - 3D Interactive Travel Platform

A modern, dynamic travel discovery platform for Sri Lanka featuring interactive 3D maps, real-time weather, and a comprehensive Admin Dashboard.

## 📁 Project Structure

```text
ExploreSriLanka/
├── client/              # React + Vite Frontend
│   ├── src/             # Application logic & components
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
└── server/              # Node.js + Express Backend
    ├── index.js         # API server logic
    ├── data/            # JSON database (locations.json)
    ├── uploads/         # Admin uploaded images
    └── package.json     # Backend dependencies
```

## 🚀 Getting Started

### 1. Start the Backend Server
```bash
cd server
npm install
npm start (or node index.js)
```
*The server will run on `http://localhost:5001`*

### 2. Start the Frontend Application
```bash
cd client
npm install
npm run dev
```
*The app will be available at `http://localhost:5173`*

## 🛠 Features
- **Interactive 3D Map:** Click on any district to explore.
- **Dynamic Content:** All locations and details are served from the backend.
- **Admin Dashboard:** Full CMS for managing destinations, direct image uploads, and map codes.
- **Responsive Details:** Real-time weather, maps, and rich informational cards.
