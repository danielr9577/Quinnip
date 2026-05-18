const express = require("express");
const app = express();

const db = require("./baseDeDatos"); // 👈 usa tu nombre de archivo

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend 🚀");
});


// 🔥 POST: guardar marcador
app.post("/marcadores", (req, res) => {
    const m = req.body;

    const query = `
        INSERT INTO marcadores (nombre, idPartido, casa, visita, golesCasa, golesVisita, uid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(uid, idPartido)
        DO UPDATE SET
            golesCasa=excluded.golesCasa,
            golesVisita=excluded.golesVisita
    `;

    db.run(query, [
        m.nombre,
        m.idPartido,
        m.casa,
        m.visita,
        m.golesCasa,
        m.golesVisita,
	m.uid
    ], function (err) {
        if (err) {
            console.log("❌ Error:", err);
            return res.status(500).json({ error: "Error guardando" });
        }

        console.log("✅ Guardado en DB:", m);
        res.json({ ok: true });
    });
});


// 📥 GET: obtener todos los marcadores
app.get("/marcadores", (req, res) => {
    db.all("SELECT * FROM marcadores", [], (err, rows) => {
        if (err) {
            console.log("❌ Error:", err);
            return res.status(500).json({ error: "Error leyendo" });
        }

        res.json(rows);
    });
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});