require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Railway asigna un puerto dinámico

app.use(cors());
app.use(express.json()); 
app.use(express.static("public")); // Sirve archivos estáticos (frontend)

// HTML principal
app.get("https://dbcloudcrud-production.up.railway.app/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conexión a CockroachDB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  application_name: "web_app",
});

// Rutas del backend
app.get("https://dbcloudcrud-production.up.railway.app/accounts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las cuentas" });
  }
});

app.post("https://dbcloudcrud-production.up.railway.app/accounts", async (req, res) => {
    const { nombre, balance, telefono } = req.body;
    try {
        await pool.query("INSERT INTO accounts (nombre, balance, telefono) VALUES ($1, $2, $3);", [nombre, balance, telefono]);
        res.status(201).json({ message: "Cuenta creada." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la cuenta." });
    }
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
