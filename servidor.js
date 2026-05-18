const express = require("express");
const app = express();

const db = require("./baseDeDatos"); // 👈 usa tu nombre de archivo

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend 🚀");
});


// 🔥 POST: guardar marcador
app.post("/marcadores", (req, res) => {
try {
    const m = req.body;

    const stmt = db.prepare(`
        INSERT INTO marcadores (nombre, idPartido, casa, visita, golesCasa, golesVisita, uid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(uid, idPartido)
        DO UPDATE SET
            golesCasa=excluded.golesCasa,
            golesVisita=excluded.golesVisita
    `);

    stmt.run(
        m.nombre,
        m.idPartido,
        m.casa,
        m.visita,
        m.golesCasa,
        m.golesVisita,
	m.uid
    );

        console.log("✅ Guardado en DB:", m);
        res.json({ ok: true });
} catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error guardando" });
    }
});


// 📥 GET: obtener todos los marcadores
app.get("/marcadores", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM marcadores").all();
        res.json(rows);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo" });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});