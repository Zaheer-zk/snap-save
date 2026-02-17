# Deployment Guide

This guide outlines the steps to deploy the **SnapSave** application, which consists of a React frontend and a Node.js backend.

## Architecture Overview
- **Frontend (Client)**: React + Vite application. Deploys to static hosting (Vercel, Netlify).
- **Backend (Server)**: Node.js + Express application. Deploys to a Node.js runtime (Render, Railway, Heroku).

---

## 🚀 Step 1: Deploy the Backend (Server)

We recommend using **Render** or **Railway** for the backend as they have great free tiers/starter support for Node.js.

### Option A: Deploy on Render.com

1.  **Push your code to GitHub/GitLab**.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your repository.
5.  Configure the service:
    -   **Name**: `snap-save-api` (or similar)
    -   **Root Directory**: `server` (Important!)
    -   **Runtime**: Node
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`
6.  **Environment Variables**:
    -   Add `PORT` with value `3000` (Render handles port binding automatically usually, but good to set).
    -   Add `CORS_ORIGIN` with value `*` (initially, then update to your frontend URL later).
7.  Click **Deploy**.
8.  **Copy the URL** provided by Render (e.g., `https://snap-save-api.onrender.com`).

---

## 🌐 Step 2: Deploy the Frontend (Client)

We recommend **Vercel** for the frontend for easiest configuration.

### Deploy on Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your repository.
4.  **Configure Project**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: Click `Edit` and select `client`.
5.  **Build & Output Settings**:
    -   Should auto-detect: `npm run build` and `dist`.
6.  **Environment Variables**:
    -   Add `VITE_API_URL`.
    -   **Value**: The backend URL from Step 1 + `/api/v1` (e.g., `https://snap-save-api.onrender.com/api/v1`).
7.  Click **Deploy**.

---

## 🔗 Step 3: Final Configuration

1.  Go back to your **Backend Deployment** (Render/Railway).
2.  Update the `CORS_ORIGIN` environment variable to your new **Frontend URL** (e.g., `https://snap-save.vercel.app`) to secure your API.
    -   *Note: If you want to allow all domains, keep it as `*`.*

---

## 🛠 Local Development

To run the project locally:

1.  Install dependencies in root, client, and server:
    ```bash
    npm install
    cd client && npm install
    cd ../server && npm install
    ```
2.  Start both services from the root:
    ```bash
    npm start
    ```
    -   Frontend: `http://localhost:8080`
    -   Backend: `http://localhost:3000`
