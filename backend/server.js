const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const connectionString =
  process.env.DATABASE_URL ||
  process.env.MONGO_URI ||
  process.env.POSTGRES_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: !connectionString.includes("localhost")
          ? { rejectUnauthorized: false }
          : false,
      }
    : {}
);

const createTable = async () => {
  if (!connectionString) {
    console.error(
      "Database connection string (DATABASE_URL) is missing in environment variables"
    );
    return;
  }
  const query = `
    CREATE TABLE IF NOT EXISTS hotels (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      latitude NUMERIC NOT NULL,
      longitude NUMERIC NOT NULL,
      image TEXT NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log("PostgreSQL connected and hotels table ready");
  } catch (error) {
    console.error(
      "Database initialization error:",
      error.message || String(error)
    );
  }
};

app.get("/", (req, res) => {
  res.send("Namla API is running");
});

app.get("/api/hotels", async (req, res) => {
  if (!connectionString) {
    return res.status(500).json({
      error:
        "Database connection string (DATABASE_URL) is missing in environment variables.",
    });
  }
  try {
    const result = await pool.query(
      "SELECT id, title, description, price::float, latitude::float, longitude::float, image FROM hotels ORDER BY id DESC;"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  if (!connectionString) {
    return res.status(500).json({
      error:
        "Database connection string (DATABASE_URL) is missing in environment variables.",
    });
  }
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, title, description, price::float, latitude::float, longitude::float, image FROM hotels WHERE id = $1;",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.post("/api/hotels", async (req, res) => {
  if (!connectionString) {
    return res.status(500).json({
      error:
        "Database connection string (DATABASE_URL) is missing in environment variables.",
    });
  }
  const { title, description, price, latitude, longitude, image } = req.body;
  if (
    !title ||
    !description ||
    price === undefined ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO hotels (title, description, price, latitude, longitude, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, price::float, latitude::float, longitude::float, image;",
      [
        title.trim(),
        description.trim(),
        Number(price),
        Number(latitude),
        Number(longitude),
        image || "",
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.put("/api/hotels/:id", async (req, res) => {
  if (!connectionString) {
    return res.status(500).json({
      error:
        "Database connection string (DATABASE_URL) is missing in environment variables.",
    });
  }
  const { id } = req.params;
  const { title, description, price, latitude, longitude, image } = req.body;
  if (
    !title ||
    !description ||
    price === undefined ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await pool.query(
      "UPDATE hotels SET title = $1, description = $2, price = $3, latitude = $4, longitude = $5, image = $6 WHERE id = $7 RETURNING id, title, description, price::float, latitude::float, longitude::float, image;",
      [
        title.trim(),
        description.trim(),
        Number(price),
        Number(latitude),
        Number(longitude),
        image || "",
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.delete("/api/hotels/:id", async (req, res) => {
  if (!connectionString) {
    return res.status(500).json({
      error:
        "Database connection string (DATABASE_URL) is missing in environment variables.",
    });
  }
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING id, title;",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted successfully", hotel: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.listen(PORT, async () => {
  await createTable();
  console.log(`Server is running on port ${PORT}`);
});
