# Hotel Listing CRUD Website

A full-stack Hotel Listing CRUD web application built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

- **Hotel Listing**: Responsive card layout displaying hotel image, title, price, description snippet, and coordinates.
- **Card Navigation**: Click anywhere on a hotel card to view its detailed page, with subtle hover lift and soft shadow effects.
- **Add & Edit Hotel**: Reusable form component to create and update hotel listings.
- **Image Upload & Live Preview**: Upload local images converted to Base64 or enter an image URL with instant preview.
- **Geolocation API**: Auto-fill latitude and longitude coordinates using browser geolocation.
- **Location Map Display**: Embedded Google Maps view pinpointing the hotel's exact coordinates.
- **Search & Filter**: Real-time hotel title search and price range filtering (min/max price) with a collapsible toggle button.
- **Pagination**: Easy pagination navigation across listed hotels.
- **Delete with Confirmation**: Modal popup confirmation before deletion and temporary success message banner.
- **Dynamic SEO Meta Tags**: Page titles and descriptions dynamically set with React Helmet Async.
- **Persistent Database**: All hotel operations (Create, Read, Update, Delete) are saved permanently in MongoDB.

## Tech Stack

### Frontend
- React 19
- Redux Toolkit & React-Redux
- React Router DOM
- Axios
- React Helmet Async
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Cors & Dotenv

## Project Structure

```text
Namla/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
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
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/hotels` | Fetch all hotels |
| `GET` | `/api/hotels/:id` | Fetch a single hotel by ID |
| `POST` | `/api/hotels` | Create a new hotel |
| `PUT` | `/api/hotels/:id` | Update an existing hotel |
| `DELETE` | `/api/hotels/:id` | Delete a hotel |
