import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { addHotel, updateHotel } from "../redux/hotelSlice";
import api from "../services/api";
import "./HotelForm.css";

function HotelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotels = useSelector((state) => state.hotels.hotels);
  const isEditMode = Boolean(id);

  const existingHotel = isEditMode
    ? hotels.find((hotel) => String(hotel.id) === String(id))
    : null;

  const [title, setTitle] = useState(existingHotel ? existingHotel.title : "");
  const [description, setDescription] = useState(
    existingHotel ? existingHotel.description : ""
  );
  const [price, setPrice] = useState(existingHotel ? existingHotel.price : "");
  const [latitude, setLatitude] = useState(
    existingHotel ? existingHotel.latitude : ""
  );
  const [longitude, setLongitude] = useState(
    existingHotel ? existingHotel.longitude : ""
  );
  const [image, setImage] = useState(existingHotel ? existingHotel.image : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingHotel, setLoadingHotel] = useState(isEditMode && !existingHotel);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && !existingHotel) {
      api
        .get(`/hotels/${id}`)
        .then((res) => {
          const hotel = res.data;
          setTitle(hotel.title || "");
          setDescription(hotel.description || "");
          setPrice(hotel.price || "");
          setLatitude(hotel.latitude || "");
          setLongitude(hotel.longitude || "");
          setImage(hotel.image || "");
        })
        .catch((err) => {
          setErrorMessage(
            err.response?.data?.error ||
              (err.response
                ? `Server returned ${err.response.status} (${err.response.statusText || "Error"})`
                : "Failed to load hotel details from database.")
          );
        })
        .finally(() => {
          setLoadingHotel(false);
        });
    }
  }, [id, isEditMode, existingHotel]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      (error) => {
        alert("Failed to get current location: " + error.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a hotel title.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please enter a hotel description.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMessage("Please enter a valid positive price.");
      return;
    }

    if (latitude === "" || isNaN(Number(latitude))) {
      setErrorMessage("Please enter a valid numeric latitude.");
      return;
    }

    if (longitude === "" || isNaN(Number(longitude))) {
      setErrorMessage("Please enter a valid numeric longitude.");
      return;
    }

    const defaultImage =
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60";

    const hotelData = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      latitude: Number(latitude),
      longitude: Number(longitude),
      image: image.trim() || defaultImage,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const response = await api.put(`/hotels/${id}`, hotelData);
        dispatch(updateHotel(response.data));
        alert("Hotel updated successfully!");
        navigate(`/hotel/${id}`);
      } else {
        const response = await api.post("/hotels", hotelData);
        dispatch(addHotel(response.data));
        alert("Hotel added successfully!");
        navigate("/");
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error ||
          (err.response
            ? `Server returned ${err.response.status} (${err.response.statusText || "Error"})`
            : "Failed to save hotel to the database.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingHotel) {
    return (
      <div className="form-card">
        <h2>Loading Hotel Details...</h2>
      </div>
    );
  }

  return (
    <div className="form-card">
      <Helmet>
        <title>
          {isEditMode ? "Edit Hotel" : "Add Hotel"} - Hotel Listing Portal
        </title>
        <meta
          name="description"
          content={
            isEditMode
              ? "Update hotel information, price and location"
              : "Add a new hotel listing with image, coordinates and price"
          }
        />
      </Helmet>

      <div className="form-header">
        <h2>{isEditMode ? "Edit Hotel" : "Add New Hotel"}</h2>
        <Link to="/" className="cancel-link">
          Back to List
        </Link>
      </div>

      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="hotel-form">
        <div className="form-group">
          <label htmlFor="title">Hotel Title *</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Grand Palace Hotel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Hotel Description *</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Enter hotel details, amenities, and surroundings..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price Per Night (₹) *</label>
          <input
            id="price"
            type="number"
            min="1"
            placeholder="e.g. 3500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="latitude">Latitude *</label>
            <input
              id="latitude"
              type="number"
              step="any"
              placeholder="e.g. 12.9716"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>

          <div className="form-group half-width">
            <label htmlFor="longitude">Longitude *</label>
            <input
              id="longitude"
              type="number"
              step="any"
              placeholder="e.g. 77.5946"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div className="geolocation-action">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="geo-btn"
          >
            Use My Current Location
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Upload Hotel Image</label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Or Enter Image URL</label>
          <input
            id="imageUrl"
            type="text"
            placeholder="https://example.com/hotel.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        {image && (
          <div className="image-preview-box">
            <p>Image Preview:</p>
            <img
              src={image}
              alt="Hotel Preview"
              className="preview-img"
            />
            <button
              type="button"
              onClick={() => setImage("")}
              className="clear-img-btn"
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Hotel"
              : "Add Hotel"}
          </button>
          <Link to="/" className="back-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default HotelForm;
