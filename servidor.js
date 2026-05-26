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
)`);

db.query(`
CREATE TABLE IF NOT EXISTS ligas (
    id SERIAL PRIMARY KEY,
administrador TEXT NOT NULL,
    nombre TEXT NOT NULL,
    codigo TEXT UNIQUE NOT NULL
);
`);

db.query(`
CREATE TABLE IF NOT EXISTS usuariosLiga (
    id SERIAL PRIMARY KEY,
    codigo TEXT,
    uid TEXT,
	UNIQUE(codigo, uid)
);
`);

function generarCodigo() {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
}

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

app.post("/ligas", async (req, res) => {
    try {
        const { administrador, nombre } = req.body;

        if (!nombre || !administrador) {
            return res.status(400).json({ error: "Administrador y Nombre requeridos" });
        }

        let codigo;
        let existe = true;

        // 🔁 asegurar código único
        while (existe) {
            codigo = generarCodigo();

            const check = await db.query(
                "SELECT id FROM ligas WHERE codigo = $1",
                [codigo]
            );

            existe = check.rows.length > 0;
        }

	await db.query("BEGIN");

        await db.query(
            "INSERT INTO ligas (nombre, administrador, codigo) VALUES ($1, $2, $3)",
            [nombre, administrador, codigo]
        );

	await db.query(
            `INSERT INTO usuariosLiga (codigo, uid)
             VALUES ($1, $2)`,
            [codigo, administrador] // puedes cambiar nombre después
        );

	await db.query("COMMIT");

        console.log("🏆 Liga creada:", nombre, administrador,codigo);

        res.json({
	administrador,
            nombre,
            codigo
        });

    } catch (err) {
        await db.query("ROLLBACK");
	console.log("❌ Error:", err);
        res.status(500).json({ error: "Error creando liga" });
    }
});


app.post("/ligas/unirse", async (req, res) => {
    try {
        const { codigo, uid, nombre } = req.body;

        // ✅ Validación básica
        if (!codigo || !uid || !nombre) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        // ✅ Verificar que la liga exista
        const liga = await db.query(
            "SELECT * FROM ligas WHERE codigo = $1",
            [codigo]
        );

        if (liga.rows.length === 0) {
            return res.status(404).json({ error: "Liga no existe" });
        }

        // ✅ Insertar usuario (evita duplicados)
        await db.query(
            `INSERT INTO usuariosLiga (codigo, uid)
             VALUES ($1, $2)
             ON CONFLICT (codigo, uid) DO NOTHING`,
            [codigo, uid]
        );

        console.log("👤 Usuario unido:", uid, "→", codigo);

        res.json({ ok: true });

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error uniendo usuario" });
    }
});

// 📥 GET: obtener todos los marcadores
app.get("/marcadores", async(req, res) => {
    try {
        const result = await db.query("SELECT * FROM marcadores");
        const mapped = result.rows.map(r => ({
            id: r.id,
            nombre: r.nombre,
            casa: r.casa,
            visita: r.visita,
            golesCasa: r.golescasa,
            golesVisita: r.golesvisita,
            idPartido: r.idpartido,   // 🔥 FIX CLAVE
            uid: r.uid
        }));

        res.json(mapped);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo" });
    }
});

app.get("/ligas", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM ligas");
        res.json(result.rows);
    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo ligas" });
    }
});

app.get("/ligas/:codigo/usuarios", async (req, res) => {
    try {
        const { codigo } = req.params;

        const result = await db.query(
            `SELECT uid FROM usuariosLiga WHERE codigo = $1`,
            [codigo]
        );

        res.json(result.rows);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error obteniendo usuarios" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});