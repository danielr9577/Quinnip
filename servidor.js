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
CREATE TABLE IF NOT EXISTS resultados (
    id SERIAL PRIMARY KEY,
    idPartido TEXT,
    casa TEXT,
    visita TEXT,
    golesCasa INTEGER,
    golesVisita INTEGER,
    UNIQUE(idPartido)
)`);

db.query(`
CREATE TABLE IF NOT EXISTS ligas (
    id SERIAL PRIMARY KEY,
administradorUid TEXT NOT NULL,
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

db.query(`
CREATE TABLE IF NOT EXISTS usuarios (
    uid TEXT PRIMARY KEY,
    nombre TEXT,
    puntos REAL DEFAULT 0
);
`);

db.query(`
CREATE TABLE IF NOT EXISTS puntosPartido (
    uid TEXT,
    idPartido TEXT,
    puntos REAL,
    PRIMARY KEY (uid, idPartido)
);
`);

const MOMIOS = {
    "mexicoSudafrica": {
        casa: 1,
        empate: 10,
        visita: 100
    },
    "coreaDelSurRepublicaCheca": {
        casa: 1000,
        empate: 10000,
        visita: 100000
    }
};

function generarCodigo() {
    return crypto.randomBytes(3).toString("hex").toUpperCase();
}

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Backend 🚀");
});


app.post("/marcadores", async (req, res) => {
	 const client = await db.connect();
    try {
        const m = req.body;

        await client.query("BEGIN");


        await client.query(`
            INSERT INTO usuarios (uid, nombre)
            VALUES ($1, $2)
            ON CONFLICT (uid) 
            DO UPDATE SET nombre = EXCLUDED.nombre
        `, [m.uid, m.nombre]);

        await client.query(`
            INSERT INTO marcadores (nombre, idPartido, casa, visita, golesCasa, golesVisita, uid)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT(uid, idPartido)
            DO UPDATE SET
                golesCasa=excluded.golesCasa,
                golesVisita=excluded.golesVisita
        `, [
            m.nombre,
            m.idPartido,
            m.casa,
            m.visita,
            m.golesCasa,
            m.golesVisita,
            m.uid
        ]);

	if (m.uid === "ADMINISTRADOR") {
    	await puntosPartido(client, m.idPartido);
        await sumarPuntos(client);
	}

        await client.query("COMMIT");

	

        console.log("✅ Guardado en DB:", m);
        res.json({ ok: true });

    } catch (err) {
        await client.query("ROLLBACK"); // 🔥 clave
	client.release();
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error guardando" });
    }
});

function definirGanador(golesCasa, golesVisita) {
    if (golesCasa == null || golesVisita == null) return null;

    if (golesCasa > golesVisita) return "casa";
    if (golesVisita > golesCasa) return "visita";
    return "empate";
}

async function puntosPartido(client, idPartido) {

    const { rows: marcadores } = await client.query(
    "SELECT * FROM marcadores WHERE idPartido = $1",
    [idPartido]
);
   

    const resultado = marcadores.find(
        m => m.uid === "ADMINISTRADOR" && m.idPartido === idPartido
    );

    if (!resultado) {
        console.log("⚠️ No hay resultado para", idPartido);
        return;
    }

    const predicciones = marcadores.filter(
        m => m.uid !== "ADMINISTRADOR" && m.idPartido === idPartido
    );

    const ganadorReal = definirGanador(
        resultado.golescasa,
        resultado.golesvisita
    );

    const momio = MOMIOS[idPartido] || { casa: 0, empate: 0, visita: 0 };

    for (const p of predicciones) {

        const ganadorUser = definirGanador(
            p.golescasa,
            p.golesvisita
        );

        let puntos = 0;

        if (ganadorReal === ganadorUser && ganadorReal !== null) {
            puntos = momio?.[ganadorReal] ?? 0;
        }

        await client.query(`
            INSERT INTO puntosPartido (uid, idPartido, puntos)
            VALUES ($1, $2, $3)
            ON CONFLICT (uid, idPartido)
            DO UPDATE SET puntos = EXCLUDED.puntos
        `, [p.uid, idPartido, puntos]);
    }
}

async function sumarPuntos(client) {
    await client.query(`
        UPDATE usuarios
SET puntos = COALESCE((
    SELECT SUM(puntos)
    FROM puntosPartido
    WHERE puntosPartido.uid = usuarios.uid), 0);
    `);
}



app.post("/ligas", async (req, res) => {
    try {
        const { administradorUid, nombre, administradorNombre } = req.body;

        if (!nombre || !administradorUid || !administradorNombre) {
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

	        await db.query(`
            INSERT INTO usuarios (uid, nombre)
            VALUES ($1, $2)
            ON CONFLICT (uid) 
            DO UPDATE SET nombre = EXCLUDED.nombre
        `, [administradorUid, administradorNombre]);

        await db.query(
            "INSERT INTO ligas (nombre, administradorUid, codigo) VALUES ($1, $2, $3)",
            [nombre, administradorUid, codigo]
        );

	await db.query(
            `INSERT INTO usuariosLiga (codigo, uid)
             VALUES ($1, $2)
             ON CONFLICT (codigo, uid) DO NOTHING`,
            [codigo, administradorUid]
        );

	await db.query("COMMIT");

        console.log("🏆 Liga creada:", nombre, administradorUid, codigo);

        res.json({
	administradorUid,
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
        const { codigo, uid, nombre} = req.body;

        // ✅ Validación básica
        if (!codigo || !uid || !nombre) {
            return res.status(400).json({ error: "Faltan datos" });
        }

	await db.query(`
            INSERT INTO usuarios (uid, nombre)
            VALUES ($1, $2)
            ON CONFLICT (uid) 
            DO UPDATE SET nombre = EXCLUDED.nombre
        `, [uid, nombre]);

        // ✅ Verificar que la liga exista
        const liga = await db.query(
            "SELECT * FROM ligas WHERE codigo = $1",
            [codigo]
        );

        if (liga.rows.length === 0) {
            return res.status(404).json({ error: "Liga no existe" });
        }

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

app.post("/usuarios/puntos", async (req, res) => {
    try {
        const { uid, puntos } = req.body;

        if (!uid || puntos === undefined) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        await db.query(`
            	INSERT INTO usuarios (uid, puntos)
		VALUES ($1, $2)
		ON CONFLICT (uid)
		DO UPDATE SET puntos = EXCLUDED.puntos
        `, [uid, puntos]);

        res.json({ ok: true });

    } catch (err) {
        console.log("❌ Error actualizando puntos:", err);
        res.status(500).json({ error: "Error actualizando puntos" });
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

app.get("/ligas/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;

        const result = await db.query(
            "SELECT * FROM ligas WHERE codigo = $1",
            [codigo]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Liga no existe" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo liga" });
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

app.get("/usuarios/:uid/ligas", async (req, res) => {
    try {
        const { uid } = req.params;

        const result = await db.query(`
            SELECT l.codigo
            FROM ligas l
            JOIN usuariosLiga u ON l.codigo = u.codigo
            WHERE u.uid = $1
        `, [uid]);

        res.json(result.rows);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error obteniendo ligas del usuario" });
    }
});


app.get("/ligas/:codigo/tabla", async (req, res) => {
    try {
        const { codigo } = req.params;

        const result = await db.query(`
            SELECT 
                u.uid,
                u.nombre,
                u.puntos
            FROM usuarios u
            JOIN usuariosLiga ul ON u.uid = ul.uid
            WHERE ul.codigo = $1
            ORDER BY u.puntos DESC
        `, [codigo]);

        res.json(result.rows);

    } catch (err) {
        console.log("❌ Error leaderboard:", err);
        res.status(500).json({ error: "Error obteniendo tabla" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});