const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("marcadores.db");

db.serialize(() => {
    console.log("🟢 Base de datos conectada");

    db.run(`
        CREATE TABLE IF NOT EXISTS marcadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            idPartido TEXT,
            casa TEXT,
            visita TEXT,
            golesCasa INTEGER,
            golesVisita INTEGER,
	    uid TEXT,
            UNIQUE(uid, idPartido)
        )
    `);
});

module.exports = db;