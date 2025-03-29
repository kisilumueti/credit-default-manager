const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL Database Connection
const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "group_J",
    password: process.env.DB_PASSWORD || "4013",
    port: 5432,
});

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Credit Default API",
            version: "1.0.0",
            description: "API for managing credit_default table",
        },
        servers: [{ url: "http://localhost:5000" }],
    },
    apis: ["./server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve React Frontend
const frontendPath = path.join(__dirname, "frontend", "build");
app.use(express.static(frontendPath));

// API Routes

/**
 * @swagger
 * /credits:
 *   get:
 *     summary: Get all credit records with search, filter, sort, and pagination
 */
app.get("/credits", async (req, res) => {
    try {
        const { search, min_balance, max_balance, sort_by, order, page, limit } = req.query;
        let query = "SELECT * FROM credit_default";
        let conditions = [];
        let values = [];

        if (search) {
            conditions.push(
                "(CAST(id AS TEXT) ILIKE $1 OR CAST(limit_balance AS TEXT) ILIKE $1 OR CAST(sex AS TEXT) ILIKE $1 OR CAST(education AS TEXT) ILIKE $1 OR CAST(marriage AS TEXT) ILIKE $1 OR CAST(age AS TEXT) ILIKE $1)"
            );
            values.push(`%${search}%`);
        }
        if (min_balance) {
            conditions.push("limit_balance >= $2");
            values.push(min_balance);
        }
        if (max_balance) {
            conditions.push("limit_balance <= $3");
            values.push(max_balance);
        }
        if (conditions.length) {
            query += " WHERE " + conditions.join(" AND ");
        }
        if (sort_by) {
            query += ` ORDER BY ${sort_by} ${order === "desc" ? "DESC" : "ASC"}`;
        }
        if (page && limit) {
            const offset = (page - 1) * limit;
            query += ` LIMIT ${limit} OFFSET ${offset}`;
        }
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /credit/{id}:
 *   get:
 *     summary: Get a single credit record by ID
 */
app.get("/credit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM credit_default WHERE id = $1", [id]);
        res.json(result.rows.length ? result.rows[0] : { message: "Record not found" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /credit:
 *   post:
 *     summary: Create a new credit record
 */
app.post("/credit", async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ["limit_balance", "sex", "education", "marriage", "age"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const keys = Object.keys(req.body).join(", ");
        const values = Object.values(req.body);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
        const result = await pool.query(
            `INSERT INTO credit_default (${keys}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /credit/{id}:
 *   put:
 *     summary: Update a credit record by ID
 */
app.put("/credit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");
        const values = [...Object.values(req.body), id];
        const result = await pool.query(
            `UPDATE credit_default SET ${updates} WHERE id = $${values.length} RETURNING *`,
            values
        );
        res.json(result.rows.length ? result.rows[0] : { message: "Record not found" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /credit/{id}:
 *   delete:
 *     summary: Delete a credit record by ID
 */
app.delete("/credit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM credit_default WHERE id = $1 RETURNING *", [id]);
        res.json(result.rows.length ? { message: "Record deleted successfully" } : { message: "Record not found" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Serve React App for all unknown routes
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));