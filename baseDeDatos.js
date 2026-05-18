const bettersqlite3 = require("better-sqlite3").verbose();

const db = new bettersqlite3("marcadores.db");

console.log("🟢 Base de datos conectada");

    db.prepare(`
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
    `).run();

module.exports = db;