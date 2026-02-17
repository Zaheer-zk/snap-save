# Backend Todo List

This file tracks the implementation plan for the backend video extraction service.

## 1. Project Setup
- [x] Initialize a new `server` or `backend` directory in the root.
- [x] Initialize `package.json` for the backend.
- [x] Install core dependencies: `express`, `cors`, `helmet`, `zod`, `dotenv`.
- [x] Install TypeScript & dev dependencies: `ts-node`, `nodemon`, `@types/express`, etc.
- [x] Setup `tsconfig.json` for the backend.
- [x] Create basic Express server structure (`app.ts`, `server.ts`).

## 2. API Implementation
- [x] Create API route structure (`routes/instagram.ts`).
- [x] Create controller for `extract` endpoint (`controllers/instagramController.ts`).
- [x] Implement input validation middleware using `Zod` (validate URL format).

## 3. Extraction Service Logic
- [x] **Crucial**: Choose and integrate a method for Instagram data extraction.
    - [x] **Option A**: Use a library like `instagram-url-direct`. (**Selected**)
    - [ ] **Option B**: Use a rapidapi wrapper (if API key available).
    - [ ] **Option C**: Custom scraper using `puppeteer` or `axios` + rigorous parsing (complex due to rate limits/changes).
- [x] Implement `VideoService` to handle the extraction logic.
    - [x] fetchMetadata(url): promise<Metadata>
    - [x] getDownloadLinks(url): promise<DownloadLink[]>
- [x] Handle different media types:
    - [x] Single Post (Image/Video)
    - [x] Reel
    - [x] IGTV
    - [x] Carousel (Multiple items) - Library handles this naturally

## 4. Error Handling & Security
- [x] Implement global error handling middleware.
- [x] Add specific error types (e.g., `InvalidUrlError`, `PrivateAccountError`, `RateLimitError`).
- [x] Configure `cors` to allow requests only from the frontend domain.
- [x] Add `helmet` for security headers.
- [ ] Implement rate limiting using `express-rate-limit`.

## 5. Development & Testing
- [ ] Add `concurrently` to the root `package.json` to run both frontend and backend with one command.
- [x] Test the `/api/extract` endpoint with Postman/Insomnia/Curl.
- [x] Verify handling of edge cases (invalid URLs, private profiles, deleted posts).

## 6. Frontend Integration
- [x] Create an API client in the frontend (`src/lib/api.ts`).
- [x] Replace the mock `setTimeout` in `src/pages/Index.tsx` with the real API call.
- [x] Update `ResultCard` to display real data from the API response.
- [x] Handle loading and error states in the UI based on API responses.
- [x] Implement the actual file download logic (handle blob/stream or direct link).

## 7. Deployment
- [ ] Configure environment variables (`PORT`, `CORS_ORIGIN`, `NODE_ENV`).
- [ ] Prepare build scripts for production (compile TS to JS).
- [ ] Test production build locally.
