# Namla - Hotel Listing CRUD Web Application

A full-stack Hotel Listing CRUD web application built with React 19, Redux Toolkit, Node.js, Express, and PostgreSQL.

## Live Deployments

- **Backend API**: [https://namla-38vr.onrender.com](https://namla-38vr.onrender.com) (Render)
- **Frontend**: Deployed on Vercel
- **Database**: PostgreSQL (Neon Cloud)

---

## Features

- **Hotel Listing**: Responsive grid layout presenting hotel image, title, price, description snippet, and location coordinates.
- **Card Navigation**: Click anywhere on a card to navigate to its details page, with subtle hover lift and soft shadow effects.
- **Add & Edit Hotels**: Forms to create new listings and update existing ones with pre-filled inputs.
- **Image Upload & Live Preview**: Upload local images automatically converted to Base64 data URLs, or paste an external image URL with live preview.
- **Geolocation Integration**: Auto-detect user coordinates via browser Geolocation API to populate latitude and longitude.
- **Interactive Map View**: Embedded Google Maps view displaying the hotel's exact coordinates.
- **Search & Filter**: Real-time title search and price range filtering (min/max price) with a collapsible filter bar.
- **Pagination**: Clean pagination controls to browse through hotel listings.
- **Delete Confirmation Modal**: Confirmation dialog prior to permanent deletion to prevent accidental removal.
- **Dynamic SEO Meta Tags**: Dynamic page titles and meta descriptions using React Helmet Async.
- **Persistent Database**: All CRUD operations permanently persist to PostgreSQL using native SQL queries.

---

## Tech Stack

### Frontend
- **React 19**
- **Vite**
- **Redux Toolkit & React-Redux**
- **React Router DOM v7**
- **Axios**
- **React Helmet Async**
- **CSS3**

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL (`pg`)**
- **CORS**
- **Dotenv**

---

## Project Structure

```text
Namla/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelDetail.css
│   │   │   ├── HotelDetail.jsx
│   │   │   ├── HotelForm.css
│   │   │   ├── HotelForm.jsx
│   │   │   ├── HotelList.css
│   │   │   ├── HotelList.jsx
│   │   │   ├── Navbar.css
│   │   │   └── Navbar.jsx
│   │   ├── redux/
│   │   │   ├── hotelSlice.js
│   │   │   └── store.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Database Schema

The `hotels` table is automatically initialized on backend startup if it does not already exist:

```sql
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  image TEXT NOT NULL
);
```

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/hotels` | Fetch all hotels (sorted newest first) |
| `GET` | `/api/hotels/:id` | Fetch a single hotel by ID |
| `POST` | `/api/hotels` | Add a new hotel |
| `PUT` | `/api/hotels/:id` | Update an existing hotel |
| `DELETE` | `/api/hotels/:id` | Delete a hotel by ID |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database instance (local or hosted on Neon / Supabase / AWS)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside `backend/`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

The server runs on `http://localhost:5000` and creates the `hotels` table automatically.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) For local backend testing, create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *If omitted, the frontend automatically defaults to the live Render backend.*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

---

## Deployment

### Backend (Render)
- **Root Directory**: `backend` (or run from root with `node backend/server.js`)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `DATABASE_URL`: Your PostgreSQL connection URI

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- The included `vercel.json` ensures client-side routing works on page refreshes without 404 errors.
