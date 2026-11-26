import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { setHotels, deleteHotel } from "../redux/hotelSlice";
import api from "../services/api";
import "./HotelList.css";

function HotelList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const hotels = useSelector((state) => state.hotels.hotels);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state && location.state.message ? location.state.message : ""
  );

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setFetchError("");
        const response = await api.get("/hotels");
        dispatch(setHotels(response.data));
      } catch (err) {
        setFetchError(
          err.response?.data?.error ||
            (err.response
              ? `Server returned ${err.response.status} (${err.response.statusText || "Error"})`
              : "Unable to connect to the backend server or database.")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handleOpenDeletePopup = (hotel) => {
    setHotelToDelete(hotel);
  };

  const handleConfirmDelete = async () => {
    if (hotelToDelete) {
      try {
        await api.delete(`/hotels/${hotelToDelete.id}`);
        dispatch(deleteHotel(hotelToDelete.id));
        setHotelToDelete(null);
        setSuccessMessage("Hotel deleted successfully!");
      } catch (err) {
        alert(
          err.response?.data?.error ||
            "Failed to delete hotel from the database."
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setHotelToDelete(null);
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesTitle = hotel.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMinPrice =
      minPrice === "" || Number(hotel.price) >= Number(minPrice);
    const matchesMaxPrice =
      maxPrice === "" || Number(hotel.price) <= Number(maxPrice);

    return matchesTitle && matchesMinPrice && matchesMaxPrice;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="hotel-list-page">
      <Helmet>
        <title>Namla Hotel Website</title>
        <meta
          name="description"
          content="Browse, search, and manage hotel listings with location and pricing filters."
        />
      </Helmet>

      <div className="list-header">
        <div>
          <h2>Available Hotels</h2>
          <p className="sub-text">
            Total Hotels: {hotels.length} | Showing {filteredHotels.length} matching
          </p>
        </div>
        <Link to="/add" className="add-hotel-btn">
          + Add New Hotel
        </Link>
      </div>

      {loading && (
        <div className="loading-banner">Loading hotels from database...</div>
      )}

      {fetchError && (
        <div className="error-banner">{fetchError}</div>
      )}

      {successMessage && (
        <div className="success-banner">{successMessage}</div>
      )}

      <div className="filter-toggle-wrapper">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          Filters {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {showFilters && (
        <div className="filters-card">
          <div className="search-field">
            <label htmlFor="search">Search by Hotel Title:</label>
            <input
              id="search"
              type="text"
              placeholder="Type hotel name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="price-filters">
            <div className="price-field">
              <label htmlFor="minPrice">Min Price (₹):</label>
              <input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={handleMinPriceChange}
              />
            </div>

            <div className="price-field">
              <label htmlFor="maxPrice">Max Price (₹):</label>
              <input
                id="maxPrice"
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="reset-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {!loading && !fetchError && currentHotels.length === 0 ? (
        <div className="no-hotels-box">
          <p>No hotels found matching your search and filter criteria.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="reset-btn"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="hotels-grid">
          {currentHotels.map((hotel) => (
            <div
              className="hotel-card"
              key={hotel.id}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              <div className="card-image-box">
                <img
                  src={hotel.image}
                  alt={hotel.title}
                  className="hotel-card-image"
                />
              </div>

              <div className="card-content">
                <h3 className="hotel-title">{hotel.title}</h3>
                <p className="hotel-price">₹{hotel.price} / night</p>
                <p className="hotel-description">{hotel.description}</p>
                <p className="hotel-coordinates">
                  Coordinates: {hotel.latitude}, {hotel.longitude}
                </p>

                <div className="card-actions">
                  <Link
                    to={`/edit/${hotel.id}`}
                    className="card-btn edit-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeletePopup(hotel);
                    }}
                    className="card-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="page-nav-btn"
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={
                  currentPage === pageNumber
                    ? "page-num-btn active-page"
                    : "page-num-btn"
                }
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="page-nav-btn"
          >
            Next &raquo;
          </button>
        </div>
      )}

      {hotelToDelete && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{hotelToDelete.title}</strong>?
            </p>
            <div className="modal-btns">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="confirm-del-btn"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="cancel-del-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelList;
