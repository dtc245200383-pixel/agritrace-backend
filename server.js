const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// API Test Server (Task S-01 - HTTP 200)
app.get("/", (req, res) => {
  res.status(200).send("AgriTrace API Sprint 1 Operational");
});

// API Khai báo thửa đất (Task S-06)
app.post("/api/land-plots", async (req, res) => {
  const { name, area, coordinates, organization_id } = req.body;

  if (!area || area <= 0) {
    return res.status(400).json({ message: "Diện tích phải lớn hơn 0" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO land_plots (name, area, coordinates, organization_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, area, coordinates, organization_id || 1],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Lỗi kết nối CSDL hoặc truy vấn thất bại",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
