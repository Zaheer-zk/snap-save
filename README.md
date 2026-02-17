# SnapSave - Instagram Video Downloader 📸

**SnapSave** (also known as *snapInsta*) is a modern, high-performance web application that allows users to download Instagram Videos, Reels, and IGTV content instantly without watermarks.

![SnapSave Demo](./client/public/og-image.png)
*(Note: Replace with actual screenshot if available)*

---

## 🚀 Features

-   **Zero Login Required**: Download content instantly without authentication.
-   **Multi-Format Support**: Works seamlessly with:
    -   Instagram Reels
    -   IGTV Videos
    -   Standard Posts (Videos & Images)
    -   Carousels (Multiple items)
-   **High Quality**: Fetches the best available resolution from Instagram.
-   **Modern UI**: Built with a sleek, responsive design using Tailwind CSS and Framer Motion.
-   **Developer Friendly**: Full TypeScript support across the entire stack.

---

## 🛠 Tech Stack

This project is structured as a **Monorepo** containing both the frontend and backend.

### **Frontend (Client)**
-   **Framework**: [React 18](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest)

### **Backend (Server)**
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Validation**: [Zod](https://zod.dev/)
-   **Extraction**: `instagram-url-direct` library for robust media data fetching.

---

## 📂 Project Structure

```bash
/snap-save
├── client/          # React Frontend application
│   ├── src/
│   └── vite.config.ts
├── server/          # Node.js Backend API
│   ├── src/
│   │   ├── services/   # Business logic (Instagram extraction)
│   │   └── routes/     # API endpoints
│   └── package.json
├── package.json     # Workspace configuration
└── DEPLOYMENT.md    # Detailed deployment guide
```

---

## ⚡ Getting Started

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v18+ recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/snap-save.git
    cd snap-save
    ```

2.  **Install dependencies**:
    Depending on your setup, you can install from the root if workspaces are configured, or individually:
    ```bash
    # Install root, client, and server dependencies
    npm install
    cd client && npm install
    cd ../server && npm install
    cd ..
    ```

### Running Locally

To run both the frontend and backend concurrently:

```bash
# From the root directory
npm start
```

-   **Frontend**: Opens at `http://localhost:8080`
-   **Backend**: Runs at `http://localhost:3000`

---

## 🌍 Environment Variables

You can configure the application using `.env` files. We have provided sensible defaults in `.env.local` for development.

**Backend (`server/.env`)**
```env
PORT=3000
CORS_ORIGIN=*  # Allow all origins for dev, restrict in prod
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 🚢 Deployment

For detailed deployment instructions for Vercel (Frontend) and Render/Railway (Backend), please refer to the **[Deployment Guide](./DEPLOYMENT.md)**.

---

## 📝 License

This project is open-source and available under the MIT License.

---

<p align="center">
  Made with Love ❤️ by <a href="https://my-portfolio-zaheer.vercel.app/" target="_blank">Zaheer Khan</a>
</p>
