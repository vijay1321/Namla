import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { deleteHotel } from "../redux/hotelSlice";
import api from "../services/api";
import "./HotelDetail.css";

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotels = useSelector((state) => state.hotels.hotels);
  const foundHotel = hotels.find((item) => String(item.id) === String(id));

  const [hotel, setHotel] = useState(foundHotel || null);
  const [loading, setLoading] = useState(!foundHotel);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!foundHotel) {
      api
        .get(`/hotels/${id}`)
        .then((res) => {
          setHotel(res.data);
          setError("");
        })
        .catch((err) => {
          setError(
            err.response?.data?.error ||
              (err.response
                ? `Server returned ${err.response.status} (${err.response.statusText || "Error"})`
                : "Hotel not found or database is unavailable.")
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, foundHotel]);

  if (loading) {
    return (
      <div className="detail-loading">
        <h2>Loading Hotel Details..</h2>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="detail-not-found">
        <Helmet>
          <title>Hotel Not Found</title>
        </Helmet>
        <h2>Hotel Not Found</h2>
        <p>
          {error ||
            "The hotel you are looking for does not exist or has been deleted."}
        </p>
        <Link to="/" className="back-link-btn">
          Back to Hotel List
        </Link>
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/hotels/${hotel.id}`);
      dispatch(deleteHotel(hotel.id));
      setShowDeleteModal(false);
      navigate("/", { state: { message: "Hotel deleted successfully!" } });
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Failed to delete hotel from the database."
      );
    }
  };

  const mapUrl = `https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=14&output=embed`;
  const externalMapUrl = `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`;

  return (
    <div className="detail-container">
      <Helmet>
        <title>{hotel.title} - Hotel Details</title>
        <meta name="description" content={hotel.description} />
      </Helmet>

      <div className="detail-top-nav">
        <Link to="/" className="back-link">
          &larr; Back to Hotels
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-image-box">
          <img
            src={hotel.image}
            alt={hotel.title}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <div className="detail-title-row">
            <h1>{hotel.title}</h1>
            <span className="detail-price">₹{hotel.price} / night</span>
          </div>

          <p className="detail-description">{hotel.description}</p>

          <div className="detail-coords-box">
            <h3>Location Coordinates</h3>
            <p>
              <strong>Latitude:</strong> {hotel.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {hotel.longitude}
            </p>
          </div>

          <div className="detail-actions">
            <Link to={`/edit/${hotel.id}`} className="detail-edit-btn">
              Edit Hotel
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="detail-delete-btn"
            >
              Delete Hotel
            </button>
          </div>
        </div>
      </div>

      <div className="detail-map-section">
        <h3>Map Location</h3>
        <div className="map-wrapper">
          <iframe
            title={`Map showing location of ${hotel.title}`}
            src={mapUrl}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
        <div className="map-external-link">
          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="external-map-btn"
          >
            Open Location in Google Maps &rarr;
          </a>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>{hotel.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleConfirmDelete}
                className="modal-confirm-btn"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-cancel-btn"
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

export default HotelDetail;
