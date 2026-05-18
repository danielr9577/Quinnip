const express = require("express");
const app = express();
const crypto = require("crypto");
const { Pool } = require("pg");
const db = require("./baseDeDatos");

db.query(`
CREATE TABLE IF NOT EXISTS marcadores (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    idPartido TEXT,
    casa TEXT,
    visita TEXT,
    golesCasa INTEGER,
    golesVisita INTEGER,
    uid TEXT,
    UNIQUE(uid, idPartido)
);

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Backend 🚀");
});


// 🔥 POST: guardar marcador
app.post("/marcadores", async(req, res) => {
try {
    const m = req.body;

    await db.query(`
        INSERT INTO marcadores (nombre, idPartido, casa, visita, golesCasa, golesVisita, uid)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT(uid, idPartido)
        DO UPDATE SET
            golesCasa=excluded.golesCasa,
            golesVisita=excluded.golesVisita
    `,

    [
        m.nombre,
        m.idPartido,
        m.casa,
        m.visita,
        m.golesCasa,
        m.golesVisita,
	m.uid
    ]);

        console.log("✅ Guardado en DB:", m);
        res.json({ ok: true });
} catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error guardando" });
    }
});


// 📥 GET: obtener todos los marcadores
app.get("/marcadores", async(req, res) => {
    try {
        const result = await db.query("SELECT * FROM marcadores");
        res.json(result.rows);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo" });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});