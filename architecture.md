# Architecture Design

## Overview
This project is an **Instagram Video Downloader** web application. It is currently a Single Page Application (SPA) built with React and Vite. The next phase involves building a robust backend to handle the actual video extraction logic, removing the reliance on client-side mocks.

## Technology Stack

### Frontend (Existing)
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query (Tanstack Query)
- **Routing**: React Router DOM
- **Animations**: Framer Motion

### Backend (Proposed)
- **Runtime**: Node.js
- **Framework**: Express.js or Hono (lightweight, fast)
- **Language**: TypeScript
- **Validation**: Zod
- **Scraping/Extraction**: Custom scraper or integration with third-party APIs (e.g., RapidAPI) or libraries like `instagram-url-direct` / `puppetter`.

## System Architecture

### 1. High-Level Flow
1.  **User Input**: User pastes an Instagram URL (Post, Reel, IGTV) into the Frontend `UrlInput` component.
2.  **Request**: Frontend sends a `POST /api/extract` request to the Backend with the URL.
3.  **Processing (Backend)**:
    -   Validates the URL format.
    -   Initiates the extraction process (web scraping or API call).
    -   Parses the response to get:
        -   Video Title
        -   Thumbnail URL
        -   Video Duration
        -   Direct Download Links (MP4) for available resolutions.
4.  **Response**: Backend sends a JSON response back to the Frontend.
5.  **Display**: Frontend displays the `ResultCard` with the extracted data.
6.  **Download**: User clicks "Download", initiating a file download directly from the source or via a proxy endpoint if needed to bypass CORs.

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
    "title": "Amazing Sunset",
    "thumbnail": "https://instagram.com/...",
    "duration": "0:15",
    "author": "user_handle",
    "downloads": [
      {
        "quality": "1080p",
        "url": "https://cdn.instagram.com/...",
        "size": "15MB" // Optional
      }
    ]
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is not accessible or private."
  }
}
```

### 3. Folder Structure (Monorepo-style or Separate)
Since the current root is the frontend, we can create a `server` directory for the backend to keep it in the same repo for simplicity.

```
/snap-save
├── src/                # Frontend Source
├── server/             # Backend Source (New)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/   # Extraction Logic
│   │   ├── utils/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json        # Root package.json (can use workspaces)
└── README.md
```

## Security & Performance Considerations
-   **Rate Limiting**: Implement strict rate limiting on the `/extract` endpoint to prevent abuse.
-   **CORS**: Configure CORS to only allow requests from the frontend domain.
-   **Validation**: Strict input validation using Zod to reject non-Instagram URLs immediately.
-   **Error Handling**: Graceful handling of changed Instagram selectors/API structures.
-   **Proxying**: If Instagram CDN links have hotlinking protection/CORS issues, a `/api/v1/download?url=...` proxy endpoint might be needed to stream the file to the user.
