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
            apuestaResultado INTEGER,
            apuestaExacto INTEGER,
            apuestaMas INTEGER,
            apuestaMenos INTEGER,
            apuestaMasCasa INTEGER,
            apuestaMenosCasa INTEGER,
            apuestaMasVisita INTEGER,
            apuestaMenosVisita INTEGER,
            apuestaDiferencia INTEGER,
            uid TEXT,
            UNIQUE(uid, idPartido)
        )
    `);

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

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 3.25 },
      { descripcion: "3.5", momio: 7 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.33 },
      { descripcion: "3.5", momio: 1.1 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 6.5 },
      { descripcion: "2.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 1.11 },
      { descripcion: "2.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "1.5", momio: 9 },
      { descripcion: "2.5", momio: 3.2 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.44},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 7.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.48 },
        { descripcion: "2", momio: 4.29 },
        { descripcion: "3", momio: 7.16 },
        { descripcion: "4", momio: 13.84 },
        { descripcion: "5", momio: 30.93 },
        { descripcion: "6", momio: 65.81 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.08 },
        { descripcion: "2", momio: 25.44 },
        { descripcion: "3", momio: 75.62 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 5.5 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 9.5 },
      { descripcion: "4-0", momio: 19 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 81 },
      { descripcion: "7-0", momio: 201 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 351 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 301 },

      { descripcion: "4-3", momio: 201 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 9 },
      { descripcion: "1-1", momio: 9 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 101 },
      { descripcion: "0-4", momio: 501 },

      { descripcion: "1-2", momio: 23 },
      { descripcion: "1-3", momio: 67 },
      { descripcion: "1-4", momio: 301 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 301 },

      { descripcion: "3-4", momio: 451 }
    ]
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
            INSERT INTO marcadores (nombre, idPartido, casa, visita, golesCasa, golesVisita, apuestaResultado, apuestaExacto, apuestaMas, apuestaMenos, apuestaMasCasa, apuestaMenosCasa, apuestaMasVisita, apuestaMenosVisita, apuestaDiferencia, uid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            ON CONFLICT(uid, idPartido)
            DO UPDATE SET
                golesCasa=excluded.golesCasa,
                golesVisita=excluded.golesVisita,
		apuestaResultado=excluded.apuestaResultado,
		apuestaExacto=excluded.apuestaExacto,
		apuestaMas=excluded.apuestaMas,
		apuestaMenos=excluded.apuestaMenos,
		apuestaMasCasa=excluded.apuestaMasCasa,
		apuestaMenosCasa=excluded.apuestaMenosCasa,
		apuestaMasVisita=excluded.apuestaMasVisita,
		apuestaMenosVisita=excluded.apuestaMenosVisita,
		apuestaDiferencia=excluded.apuestaDiferencia
        `, [
            m.nombre,
            m.idPartido,
            m.casa,
            m.visita,
            m.golesCasa,
            m.golesVisita,
	    m.apuestaResultado,
	    m.apuestaExacto,
	    m.apuestaMas,
	    m.apuestaMenos,
	    m.apuestaMasCasa,
	    m.apuestaMenosCasa,
	    m.apuestaMasVisita,
	    m.apuestaMenosVisita,
	    m.apuestaDiferencia,
            m.uid
        ]);

	if (m.uid === "ADMINISTRADOR") {
    	await puntosPartido(client, m.idPartido);
        await sumarPuntos(client);
	}

        await client.query("COMMIT");
client.release();

	

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
    
if (!MOMIOS[idPartido]) {
    console.log("⚠️ Partido sin momios:", idPartido);
}

    const { rows: marcadores } = await client.query(
    "SELECT * FROM marcadores WHERE idPartido = $1",
    [idPartido]
);
   

    const resultado = marcadores.find(
        m => m.uid === "ADMINISTRADOR"
    );

    if (!resultado) {
        console.log("⚠️ No hay resultado para", idPartido);
        return;
    }

    const predicciones = marcadores.filter(
        m => m.uid !== "ADMINISTRADOR"
    );

    const ganadorReal = definirGanador(
        resultado.golescasa,
        resultado.golesvisita
    );

    const momio = MOMIOS[idPartido] || { casa: 0, empate: 0, visita: 0 };

    for (const p of predicciones) {

        const ganadorUsuario = definirGanador(
            p.golescasa,
            p.golesvisita
        );

        let puntos = 0;
	const golesMasApostados = Number((p.golescasa + p.golesvisita - 0.5).toFixed(1));
	const golesMenosApostados = Number((p.golescasa + p.golesvisita + 0.5).toFixed(1));
	const golesMasCasaApostados = Number((p.golescasa - 0.5).toFixed(1));
	const golesMenosCasaApostados = Number((p.golescasa + 0.5).toFixed(1));
	const golesMasVisitaApostados = Number((p.golesvisita - 0.5).toFixed(1));
	const golesMenosVisitaApostados = Number((p.golesvisita + 0.5).toFixed(1));
	const diferenciaApostada = Math.abs(p.golescasa - p.golesvisita);
	const diferenciaReal = Math.abs(resultado.golescasa - resultado.golesvisita);
	const marcadorExactoUsuario = `${p.golescasa}-${p.golesvisita}`;
	const marcadorExactoReal = `${resultado.golescasa}-${resultado.golesvisita}`;
	
	console.log(`${golesMasApostados.toString()}`)
	console.log(`{$momio?.golesMasTotales?.find(r => r.descripcion === golesMasApostados.toString())?.momio}`)
	console.log(`${p.apuestaMas}`)
	if ((resultado.golescasa + resultado.golesvisita) > (golesMasApostados)){
	    puntos += (momio?.golesMasTotales?.find(r => r.descripcion === golesMasApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMas ?? 0);
	}

	if ((resultado.golescasa + resultado.golesvisita) < (golesMenosApostados)){
	    puntos += (momio?.golesMenosTotales?.find(r => r.descripcion === golesMenosApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMenos ?? 0);
	}


	if (resultado.golescasa > golesMasCasaApostados){
	    puntos += (momio?.golesMasCasa?.find(r => r.descripcion === golesMasCasaApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMasCasa ?? 0);
	}

	if (resultado.golesvisita > golesMasVisitaApostados){
	    puntos += (momio?.golesMasVisita?.find(r => r.descripcion === golesMasVisitaApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMasVisita ?? 0);
	}

	if (resultado.golescasa < golesMenosCasaApostados){
	    puntos += (momio?.golesMenosCasa?.find(r => r.descripcion === golesMenosCasaApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMenosCasa ?? 0);
	}

	if (resultado.golesvisita < golesMenosVisitaApostados){
	    puntos += (momio?.golesMenosVisita?.find(r => r.descripcion === golesMenosVisitaApostados.toString())?.momio ?? 0) * 	 	    (p.apuestaMenosVisita ?? 0);
	}

        if (ganadorReal === ganadorUsuario && ganadorReal !== null) {
            puntos += (momio?.resultado?.find(r => r.descripcion === ganadorReal)?.momio ?? 0) * (p.apuestaresultado ?? 0);
        }

	if (ganadorReal === ganadorUsuario && ganadorReal !== null && diferenciaReal === diferenciaApostada && diferenciaReal != 0) {
            if(ganadorReal === "casa"){
		puntos += (momio?.diferenciaCasa?.find(r => r.descripcion === diferenciaReal)?.momio ?? 0) * (p.apuestadiferencia ?? 		0);}
	    if(ganadorReal === "visita"){
		puntos += (momio?.diferenciaVisita?.find(r => r.descripcion === diferenciaReal)?.momio ?? 0) * 				        (p.apuestadiferencia ?? 0);}
        }
	
	if (marcadorExactoUsuario === marcadorExactoReal) {
            puntos += (momio?.marcadorExacto?.find(r => r.descripcion === marcadorExactoReal)?.momio ?? 0) * (p.apuestaExacto ?? 0);
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
	    apuestaResultado: r.apuestaresultado,
            apuestaExacto: r.apuestaexacto,
            apuestaMas: r.apuestamas,
            apuestaMenos: r.apuestamenos,
            apuestaMasCasa: r.apuestamascasa,
            apuestaMenosCasa: r.apuestamenoscasa,
	    apuestaMasVisita: r.apuestamasvisita,
            apuestaMenosVisita: r.apuestamenosvisita,
            apuestaDiferencia: r.apuestadiferencia,
            idPartido: r.idpartido,
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

app.get("/partidos", (req, res) => {
    try {
        const partidos = Object.entries(MOMIOS).map(([id, momios]) => ({
            id,
            casa: momios.casa,
            empate: momios.empate,
            visita: momios.visita
        }));

        res.json(partidos);
    } catch (err) {
        console.log("❌ Error obteniendo partidos:", err);
        res.status(500).json({ error: "Error obteniendo partidos" });
    }
});

app.get("/momios", (req, res) => {
    try {
        res.json(MOMIOS);
    } catch (err) {
        console.log("❌ Error obteniendo momios:", err);
        res.status(500).json({ error: "Error obteniendo momios" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});