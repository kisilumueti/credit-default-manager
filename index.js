require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
ap.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "group_J",
  password: "4013",
  port: 5432,
});

// Test database connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

// Get all credit defaults
app.get("/credit-defaults", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM credit_default");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a single record by ID
app.get("/credit-defaults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM credit_default WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new credit default record
app.post("/credit-defaults", async (req, res) => {
  try {
    const { limit_balance, sex, education, marriage, age, default_next_month } = req.body;
    const result = await pool.query(
      `INSERT INTO credit_default (limit_balance, sex, education, marriage, age, default_next_month)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [limit_balance, sex, education, marriage, age, default_next_month]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a credit default record
app.put("/credit-defaults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit_balance, sex, education, marriage, age, default_next_month } = req.body;
    const result = await pool.query(
      `UPDATE credit_default SET limit_balance = $1, sex = $2, education = $3,
       marriage = $4, age = $5, default_next_month = $6 WHERE id = $7 RETURNING *`,
      [limit_balance, sex, education, marriage, age, default_next_month, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a credit default record
app.delete("/credit-defaults/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM credit_default WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
