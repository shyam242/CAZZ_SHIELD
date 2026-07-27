# Deployment Guide - Cazz Shield

This guide explains how to deploy the Cazz Shield application using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier available)
- Render account (free tier available)

## Backend Deployment (Render)

### Step 1: Push to GitHub
Ensure your backend code is pushed to GitHub.

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `cazz-shield-backend`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Generate a secure random key
   - `ENVIRONMENT`: `production`

6. Click "Deploy Web Service"

### Step 3: Note the Backend URL
After deployment, Render will provide a URL like:
```
https://cazz-shield-backend.onrender.com
```
Copy this URL for the frontend configuration.

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub
Ensure your frontend code is pushed to GitHub.

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://cazz-shield-backend.onrender.com/api/v1`)

6. Click "Deploy"

### Step 3: Note the Frontend URL
After deployment, Vercel will provide a URL like:
```
https://cazz-shield-frontend.vercel.app
```

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## CORS Configuration

Ensure your backend has CORS configured to allow requests from your Vercel domain:

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cazz-shield-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_API_BASE_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check CORS configuration on backend

### Build errors on Render
- Check that `requirements.txt` includes all dependencies
- Verify Python version compatibility
- Check build logs for specific errors

### Build errors on Vercel
- Check that `package.json` has correct build scripts
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

## Updating Deployments

- Push changes to GitHub
- Vercel and Render will automatically redeploy on push to main branch
- For manual redeploy, use the respective dashboard
