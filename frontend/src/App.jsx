import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HotelList from "./components/HotelList";
import HotelForm from "./components/HotelForm";
import HotelDetail from "./components/HotelDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HotelList />} />
            <Route path="/add" element={<HotelForm />} />
            <Route path="/edit/:id" element={<HotelForm />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
