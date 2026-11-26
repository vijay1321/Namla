const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const hotelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri || uri.includes("your_mongodb_connection_string")) {
      console.log("Please provide your MongoDB connection string in backend/.env");
      return;
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

app.get("/api/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ _id: -1 });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/hotels", async (req, res) => {
  const { title, description, price, latitude, longitude, image } = req.body;
  if (!title || !description || !price || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hotel = new Hotel({
      title,
      description,
      price,
      latitude,
      longitude,
      image: image || "",
    });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/hotels/:id", async (req, res) => {
  const { title, description, price, latitude, longitude, image } = req.body;
  if (!title || !description || !price || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        latitude,
        longitude,
        image: image || "",
      },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted successfully", hotel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
