
PROJECT OVERVIEW

**Business Name:** snapInsta
**Product Type:** Web-based Instagram Video Downloader
**Target Users:** Instagram creators, editors, social media managers, marketers
**Core Problem:** Users cannot easily download their own or public Instagram videos for reposting, editing, or archiving
**Solution:** User pastes an Instagram video URL → system extracts media → user downloads video file

---

UNIQUE SELLING PROPOSITION (USP)

* No login required
* Extremely fast extraction (<5 seconds average)
* Works on reels, posts, and IGTV
* Mobile optimized downloader
* Clean file name + original quality preserved
* No watermark added
* Automatic format detection (MP4/H264)
* Safe temporary storage (auto delete after download)

---

SYSTEM CONSTRAINTS

LEGAL & COMPLIANCE

* Only allow download of publicly accessible content
* Show disclaimer: user responsible for rights
* Block private account links
* Do not scrape user accounts or profiles
* Do not store videos permanently

SECURITY

* Prevent SSRF attacks
* Validate URL domain = instagram.com
* Rate limit per IP
* Block bot abuse
* Sanitize inputs
* Temporary signed URLs only

PERFORMANCE

* Extraction response under 5 seconds
* Download streaming — no waiting for full upload
* Cache metadata for 10 minutes
* Horizontal scalable worker queue

STORAGE

* Temporary object storage (auto purge after 15 minutes)
* No permanent database storage of media
* Metadata cache only

---

TECH STACK

FRONTEND

* Next.js (App Router)
* TypeScript
* TailwindCSS
* React Server Components
* Responsive mobile-first UI
* ShadCN UI components
* SEO optimized pages

BACKEND API

* Node.js (Fastify or Express)
* REST API
* Worker queue architecture

MEDIA EXTRACTION ENGINE

* yt-dlp subprocess runner inside isolated worker container
* Queue handled via Redis + BullMQ

TEMP STORAGE

* S3 compatible storage (MinIO compatible)
* Signed download URLs

AUTOMATION / WORKER FLOW

* n8n workflow triggers after URL submission:

  1. Validate URL
  2. Fetch metadata
  3. Trigger worker job
  4. Store file temporarily
  5. Return signed link

CACHE

* Redis for metadata caching + rate limiting

DEPLOYMENT

* Dockerized services
* Reverse proxy via Nginx
* Stateless API nodes

---

FUNCTIONAL REQUIREMENTS (USER FLOW)

MAIN FLOW

1. User visits homepage
2. Pastes Instagram link
3. Clicks "Download"
4. System validates URL
5. Backend extracts metadata
6. Shows preview thumbnail
7. User selects quality (if multiple)
8. Clicks final download
9. File downloads instantly via streaming

ERROR HANDLING

* Private account message
* Invalid URL message
* Rate limit message
* Extraction failed retry option

---

NON-FUNCTIONAL REQUIREMENTS

Speed

* First interaction under 1 second
* Extraction API under 5 seconds

Scalability

* Worker-based processing
* Multiple parallel jobs
* Stateless frontend

Security

* Signed temporary download URLs
* Rate limit per IP
* Block automated scraping attempts

UX

* One-step usage
* No account creation
* Mobile optimized tap targets

SEO

* Structured metadata pages
* FAQ rich schema
* OpenGraph previews

---

PAGE STRUCTURE

1. Home Page

   * URL input box
   * Download button
   * Example link
   * Feature highlights
   * FAQ

2. Result Page

   * Video preview
   * Download button
   * Quality selector
   * Copy link option

3. How It Works

   * 3 step explanation

4. Privacy Policy

5. Terms of Service

6. Error Page

   * Friendly troubleshooting messages

---

UI / UX RULES

THEME

* Inspired by Instagram gradient (pink, purple, orange)
* White background
* Rounded inputs
* Large mobile buttons

DESIGN SYSTEM

* Clean minimalist
* Center aligned layout
* Mobile first responsive
* Dark mode support

INTERACTIONS

* Loading animation during extraction
* Progress indicator
* Copy-paste detection auto fill

---

API & AUTOMATION LOGIC

API ENDPOINTS

POST /api/validate
→ Validates URL

POST /api/extract
→ Adds job to queue

GET /api/status/{jobId}
→ Returns metadata + preview

GET /api/download/{token}
→ Streams file

WORKER FLOW

1. Receive job
2. Run yt-dlp
3. Store temp file
4. Generate signed URL
5. Update Redis cache

AUTO DELETE
Cron job deletes files older than 15 minutes

---

MONETIZATION

Google AdSense integration

* Header banner
* Below result card
* Between FAQ sections

Ads must not block download button

---

OUTPUT EXPECTATIONS

Generate:

* Full frontend code
* Backend API
* Worker queue
* Docker configuration
* n8n workflow JSON
* Environment variables
* Proper folder structure
* Production-ready configuration

All code must compile and run without manual fixes.

---

RESTRICTIONS

Do NOT:

* Require login
* Store user videos permanently
* Use unofficial scraping in frontend
* Expose yt-dlp to public
* Use client-side extraction
