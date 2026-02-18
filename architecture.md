# Architecture Design

## Overview
This project is an **Instagram Video Downloader** web application, structured as a monorepo with a React frontend and a Node.js backend. The backend handles video extraction logic using specialized libraries to bypass restrictions and provide direct download links.

## Technology Stack

### Frontend (Client)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query (Tanstack Query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Extraction**: Custom multi-strategy scraper (`axios` + `cheerio`) with fallbacks (HTML scraping → GraphQL → Embed)
- **Utilities**: `axios`, `cors`, `helmet`, `dotenv`

## System Architecture

### 1. High-Level Flow
1.  **User Input**: User pastes an Instagram URL (Post, Reel, IGTV) into the Frontend `UrlInput` component.
2.  **Request**: Frontend sends a `POST /api/v1/extract` request to the Backend with the URL.
3.  **Processing (Backend)**:
    -   Validates the URL using Zod.
    -   Uses `instagram-url-direct` to fetch media details.
    -   Extracts metadata (thumbnail, video URL, etc.).
    -   Constructs a standardized response object.
4.  **Response**: Backend sends a JSON response with video details and download links.
5.  **Display**: Frontend displays the `ResultCard` with the video thumbnail and download options.
6.  **Download**: User clicks "Download". The frontend triggers a file download, potentially proxying through the backend if needed to handle CORS/Content-Disposition (future enhancement).

### 2. API Design

#### POST `/api/v1/extract`
**Request Body:**
```json
{
  "url": "https://www.instagram.com/reel/Cm..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "media_id_123",
    "title": "Instagram Video",
    "thumbnail": "https://instagram.com/...",
    "duration": "0:15",
    "author": "user_handle", // Optional
    "downloads": [
      {
        "quality": "Original",
        "url": "https://cdn.instagram.com/..."
      }
    ]
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Failed to extract video metadata"
}
```

### 3. Folder Structure (Monorepo)
The project identifies as a monorepo with distinct workspaces for client and server.

```
/snap-save
├── client/             # Frontend Application (Vite + React)
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
├── server/             # Backend Application (Node + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/   # Extraction Logic (instagram.service.ts)
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json        # Root package.json (Manager)
└── architecture.md     # System Design Documentation
```

## Security & Performance Considerations
-   **Rate Limiting**: To prevent abuse.
-   **CORS**: Configured to allow requests from the frontend domain.
-   **Validation**: Strict input validation using Zod.
-   **Error Handling**: Centralized error handling in the backend.
