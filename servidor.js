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
  "mexicosudafrica": {

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
      { descripcion: "2.5", momio: 2.34 },	
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.61 },
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
        { descripcion: "4", momio: 14 },
        { descripcion: "5", momio: 31 },
        { descripcion: "6", momio: 66 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.1 },
        { descripcion: "2", momio: 25.5 },
        { descripcion: "3", momio: 75.5 }
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
  },
"coreadelsurrepublicacheca": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 19 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.02 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.69 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.59 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.62},
      { descripcion: "empate", momio: 3.1},
      { descripcion: "visita", momio: 2.7}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.63 },
        { descripcion: "2", momio: 8.3 },
        { descripcion: "3", momio: 18.5 },
        { descripcion: "4", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.79 },
        { descripcion: "2", momio: 8.67 },
        { descripcion: "3", momio: 18.5 },
	{ descripcion: "4", momio: 46 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 13 },
      { descripcion: "3-0", momio: 29 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 151 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 23 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },
      { descripcion: "6-1", momio: 501 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 501 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 351 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 13 },
      { descripcion: "0-3", momio: 29 },
      { descripcion: "0-4", momio: 67 },
      { descripcion: "0-5", momio: 151 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 26 },
      { descripcion: "1-4", momio: 51 },
      { descripcion: "1-5", momio: 151 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 251 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 501 }
    ]
  },
"canadabosniayherzegovina": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.22 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 4.33 },
      { descripcion: "3.5", momio: 11 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 1.2 },
      { descripcion: "3.5", momio: 1.05 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 3.16 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.8},
      { descripcion: "empate", momio: 3.7},
      { descripcion: "visita", momio: 4.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.86 },
        { descripcion: "2", momio: 5.44 },
        { descripcion: "3", momio: 11 },
        { descripcion: "4", momio: 22.5 },
        { descripcion: "5", momio: 50 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6.68 },
        { descripcion: "2", momio: 14.5 },
        { descripcion: "3", momio: 34 },
	{ descripcion: "4", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 15 },
      { descripcion: "4-0", momio: 34 },
      { descripcion: "5-0", momio: 67 },
      { descripcion: "6-0", momio: 151 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 201 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 401 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 23 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 151 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 501 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 },
    ]
  },
"estadosunidosparaguay": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 1.16 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.95},
      { descripcion: "empate", momio: 3.4},
      { descripcion: "visita", momio: 4}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.86 },
        { descripcion: "2", momio: 5.87 },
        { descripcion: "3", momio: 12 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 61}
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6 },
        { descripcion: "2", momio: 14 },
        { descripcion: "3", momio: 34 },
	{ descripcion: "4", momio: 96 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 8.5 },
      { descripcion: "3-0", momio: 17 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 81 },
      { descripcion: "6-0", momio: 251 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 10 },
      { descripcion: "0-2", momio: 21 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 126 },
      { descripcion: "0-5", momio: 501 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 401 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 126 },
      { descripcion: "2-5", momio: 501 },

      { descripcion: "3-4", momio: 201 },
    ]
  },
"catarsuiza": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.1 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.66 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 2.23 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 19 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.06 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.02 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 12},
      { descripcion: "empate", momio: 6.25},
      { descripcion: "visita", momio: 1.22}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 14.5 },
        { descripcion: "2", momio: 34 },
        { descripcion: "3", momio: 143 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.28 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 5.25 },
	{ descripcion: "4", momio: 8.3 },
        { descripcion: "5", momio: 15 },
        { descripcion: "6", momio: 31 },
	{ descripcion: "7", momio: 66 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 26 },
      { descripcion: "2-0", momio: 51 },
      { descripcion: "3-0", momio: 201 },

      { descripcion: "2-1", momio: 34 },
      { descripcion: "3-1", momio: 101 },
      { descripcion: "4-1", momio: 501 },

      { descripcion: "3-2", momio: 81 },
      { descripcion: "4-2", momio: 451 },

      { descripcion: "4-3", momio: 501 },

      { descripcion: "0-0", momio: 13 },
      { descripcion: "1-1", momio: 13 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 7 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 7 },
      { descripcion: "0-4", momio: 11 },
      { descripcion: "0-5", momio: 21 },
      { descripcion: "0-6", momio: 41 },
      { descripcion: "0-7", momio: 81 },
      { descripcion: "0-8", momio: 201 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 21 },
      { descripcion: "1-5", momio: 34 },
      { descripcion: "1-6", momio: 51 },
      { descripcion: "1-7", momio: 126 },
      { descripcion: "1-8", momio: 351 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 151 },
      { descripcion: "2-7", momio: 351 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 301 },
    ]
  },
"brasilmarruecos": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 9 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.071 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.53 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9.5 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.68 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.65},
      { descripcion: "empate", momio: 3.75},
      { descripcion: "visita", momio: 5.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 5 },
        { descripcion: "3", momio: 8.98 },
        { descripcion: "4", momio: 17 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 98.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.72 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 43.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 13 },
      { descripcion: "4-0", momio: 26 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 126 },
      { descripcion: "7-0", momio: 401 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 151 },
      { descripcion: "7-1", momio: 451 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 301 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 9.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 451 },

      { descripcion: "0-1", momio: 13 },
      { descripcion: "0-2", momio: 29 },
      { descripcion: "0-3", momio: 67 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 19 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 },
    ]
  },
"haitiescocia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 3 },
      { descripcion: "3.5", momio: 7 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.36 },
      { descripcion: "3.5", momio: 1.1 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.81 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 12 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.7 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5.25},
      { descripcion: "empate", momio: 4.75},
      { descripcion: "visita", momio: 1.53}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.37 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 46.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 4.55 },
        { descripcion: "3", momio: 7.73 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 64 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 29 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 251 },

      { descripcion: "2-1", momio: 17 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 201 },

      { descripcion: "0-0", momio: 12 },
      { descripcion: "1-1", momio: 9 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 7 },
      { descripcion: "0-2", momio: 7 },
      { descripcion: "0-3", momio: 11 },
      { descripcion: "0-4", momio: 21 },
      { descripcion: "0-5", momio: 41 },
      { descripcion: "0-6", momio: 81 },
      { descripcion: "0-7", momio: 251 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 26 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 101 },
      { descripcion: "1-7", momio: 301 },

      { descripcion: "2-3", momio: 29 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 201 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 251 }
    ]
  },
"australiaturquia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.68 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.7 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5},
      { descripcion: "empate", momio: 3.6},
      { descripcion: "visita", momio: 1.7}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.37 },
        { descripcion: "2", momio: 16 },
        { descripcion: "3", momio: 34 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 5.22 },
        { descripcion: "3", momio: 9.4 },
        { descripcion: "4", momio: 18.5 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 26 },
      { descripcion: "3-0", momio: 51 },
      { descripcion: "4-0", momio: 151 },

      { descripcion: "2-1", momio: 17 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 101 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 126 },

      { descripcion: "4-3", momio: 201 },

      { descripcion: "0-0", momio: 9.5 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 401 },

      { descripcion: "0-1", momio: 7 },
      { descripcion: "0-2", momio: 8 },
      { descripcion: "0-3", momio: 13 },
      { descripcion: "0-4", momio: 29 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 151 },
      { descripcion: "0-7", momio: 451 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 29 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 101 },
      { descripcion: "2-6", momio: 301 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 301 }
    ]
  },
"alemaniacurazao": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.01 },
      { descripcion: "1.5", momio: 1.071 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.66 },
      { descripcion: "4.5", momio: 2.5 },
      { descripcion: "5.5", momio: 4.33 },
      { descripcion: "6.5", momio: 8 },
      { descripcion: "7.5", momio: 15 },
      { descripcion: "8.5", momio: 29 },
      { descripcion: "9.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 26 },
      { descripcion: "1.5", momio: 9 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 2.1 },
      { descripcion: "4.5", momio: 1.5 },
      { descripcion: "5.5", momio: 1.2 },
      { descripcion: "6.5", momio: 1.083 },
      { descripcion: "7.5", momio: 1.03 },
      { descripcion: "8.5", momio: 1.006 },
      { descripcion: "9.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 11 },
      { descripcion: "2.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 1.05 },
      { descripcion: "2.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.005 },
      { descripcion: "1.5", momio: 1.05 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.5 },
      { descripcion: "4.5", momio: 2.1 },
      { descripcion: "5.5", momio: 3.4 },
      { descripcion: "6.5", momio: 5.5 },
      { descripcion: "7.5", momio: 10 },
      { descripcion: "8.5", momio: 19 },
      { descripcion: "9.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 34 },
      { descripcion: "1.5", momio: 11 },
      { descripcion: "2.5", momio: 4.73 },
      { descripcion: "3.5", momio: 2.62 },
      { descripcion: "4.5", momio: 1.72 },
      { descripcion: "5.5", momio: 1.33 },
      { descripcion: "6.5", momio: 1.14 },
      { descripcion: "7.5", momio: 1.062 },
      { descripcion: "8.5", momio: 1.02 },
      { descripcion: "9.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.035},
      { descripcion: "empate", momio: 17},
      { descripcion: "visita", momio: 34}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 8.97 },
        { descripcion: "2", momio: 5.63 },
        { descripcion: "3", momio: 4.77 },
        { descripcion: "4", momio: 5.11 },
        { descripcion: "5", momio: 6.41 },
        { descripcion: "6", momio: 9.87 },
        { descripcion: "7", momio: 15 },
        { descripcion: "8", momio: 29 },
        { descripcion: "9", momio: 40.5 },
        { descripcion: "10", momio: 84 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 33.5 },
        { descripcion: "2", momio: 128 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 17 },
      { descripcion: "2-0", momio: 9 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 7 },
      { descripcion: "5-0", momio: 8.5 },
      { descripcion: "6-0", momio: 13 },
      { descripcion: "7-0", momio: 21 },
      { descripcion: "8-0", momio: 41 },
      { descripcion: "9-0", momio: 51 },
      { descripcion: "10-0", momio: 101 },
      { descripcion: "11-0", momio: 251 },

      { descripcion: "2-1", momio: 19 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 15 },
      { descripcion: "5-1", momio: 19 },
      { descripcion: "6-1", momio: 26 },
      { descripcion: "7-1", momio: 41 },
      { descripcion: "8-1", momio: 51 },
      { descripcion: "9-1", momio: 101 },
      { descripcion: "10-1", momio: 201 },
      { descripcion: "11-1", momio: 501 },


      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 51 },
      { descripcion: "6-2", momio: 67 },
      { descripcion: "7-2", momio: 101 },
      { descripcion: "8-2", momio: 201 },
      { descripcion: "9-2", momio: 401 },

      { descripcion: "4-3", momio: 201 },
      { descripcion: "5-3", momio: 251 },
      { descripcion: "6-3", momio: 351 },

      { descripcion: "0-0", momio: 34 },
      { descripcion: "1-1", momio: 34 },
      { descripcion: "2-2", momio: 51 },
      { descripcion: "3-3", momio: 201 },

      { descripcion: "0-1", momio: 67 },
      { descripcion: "0-2", momio: 201 },

      { descripcion: "1-2", momio: 67 },
      { descripcion: "1-3", momio: 351 },

      { descripcion: "2-3", momio: 201 }
    ]
  },
"paisesbajosjapon": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.22 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 4.33 },
      { descripcion: "3.5", momio: 11 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 1.2 },
      { descripcion: "3.5", momio: 1.05 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 9 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.071 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 26 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.67 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.01 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2},
      { descripcion: "empate", momio: 3.75},
      { descripcion: "visita", momio: 3.4}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.34 },
        { descripcion: "2", momio: 6.3 },
        { descripcion: "3", momio: 13 },
        { descripcion: "4", momio: 25.5 },
        { descripcion: "5", momio: 57.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.74 },
        { descripcion: "2", momio: 11.5 },
        { descripcion: "3", momio: 25.5 },
        { descripcion: "4", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 10 },
      { descripcion: "3-0", momio: 19 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 81 },
      { descripcion: "6-0", momio: 201 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 201 },

      { descripcion: "3-2", momio: 29 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 351 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 51 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 301 },

      { descripcion: "1-2", momio: 12 },
      { descripcion: "1-3", momio: 29 },
      { descripcion: "1-4", momio: 67 },
      { descripcion: "1-5", momio: 201 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 251 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 501 },
    ]
  },
"costademarfilecuador": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 8 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.083 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.12 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 5.5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 6 },
      { descripcion: "1.5", momio: 2.3 },
      { descripcion: "2.5", momio: 1.27 },
      { descripcion: "3.5", momio: 1.14 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.5},
      { descripcion: "empate", momio: 2.9},
      { descripcion: "visita", momio: 2.3}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 5 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 29 },
        { descripcion: "4", momio: 80.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.88 },
        { descripcion: "2", momio: 7.22 },
        { descripcion: "3", momio: 16 },
        { descripcion: "4", momio: 38 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 17 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 101 },
      { descripcion: "5-0", momio: 451 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 101 },
      { descripcion: "5-1", momio: 401 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 351 },

      { descripcion: "0-0", momio: 5.5 },
      { descripcion: "1-1", momio: 6 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 10 },
      { descripcion: "0-3", momio: 23 },
      { descripcion: "0-4", momio: 51 },
      { descripcion: "0-5", momio: 151 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 26 },
      { descripcion: "1-4", momio: 51 },
      { descripcion: "1-5", momio: 151 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 351 },

      { descripcion: "3-4", momio: 251 }
    ]
  },
"sueciatunez": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 4.5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 1.18 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.85},
      { descripcion: "empate", momio: 3.4},
      { descripcion: "visita", momio: 4.33}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.86 },
        { descripcion: "2", momio: 5.87 },
        { descripcion: "3", momio: 12 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6 },
        { descripcion: "2", momio: 14 },
        { descripcion: "3", momio: 34 },
        { descripcion: "4", momio: 113 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 8.5 },
      { descripcion: "3-0", momio: 17 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 81 },
      { descripcion: "6-0", momio: 201 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 10 },
      { descripcion: "0-2", momio: 21 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 151 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 451 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 126 },
      { descripcion: "2-5", momio: 501 },

      { descripcion: "3-4", momio: 201 }
    ]
  },
"espanacaboverde": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.53 },
      { descripcion: "3.5", momio: 2.37 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.37 },
      { descripcion: "3.5", momio: 1.53 },
      { descripcion: "4.5", momio: 1.22 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.37 },
      { descripcion: "1.5", momio: 10 },
      { descripcion: "2.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.53 },
      { descripcion: "1.5", momio: 1.062 },
      { descripcion: "2.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.012 },
      { descripcion: "1.5", momio: 1.11 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.9 },
      { descripcion: "4.5", momio: 3.2 },
      { descripcion: "5.5", momio: 5 },
      { descripcion: "6.5", momio: 10 },
      { descripcion: "7.5", momio: 19 },
      { descripcion: "8.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 23 },
      { descripcion: "1.5", momio: 6.5 },
      { descripcion: "2.5", momio: 2.29 },
      { descripcion: "3.5", momio: 1.9 },
      { descripcion: "4.5", momio: 1.36 },
      { descripcion: "5.5", momio: 1.16 },
      { descripcion: "6.5", momio: 1.062 },
      { descripcion: "7.5", momio: 1.02 },
      { descripcion: "8.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.083},
      { descripcion: "empate", momio: 11},
      { descripcion: "visita", momio: 26}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 5.65 },
        { descripcion: "2", momio: 4.55 },
        { descripcion: "3", momio: 4.53 },
        { descripcion: "4", momio: 5.94 },
        { descripcion: "5", momio: 9.28 },
        { descripcion: "6", momio: 15 },
        { descripcion: "7", momio: 29 },
        { descripcion: "8", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 22.5 },
        { descripcion: "2", momio: 67 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 10 },
      { descripcion: "2-0", momio: 7 },
      { descripcion: "3-0", momio: 6.5 },
      { descripcion: "4-0", momio: 8 },
      { descripcion: "5-0", momio: 12 },
      { descripcion: "6-0", momio: 21 },
      { descripcion: "7-0", momio: 41 },
      { descripcion: "8-0", momio: 67 },
      { descripcion: "9-0", momio: 151 },
      { descripcion: "10-0", momio: 401 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 15 },
      { descripcion: "5-1", momio: 23 },
      { descripcion: "6-1", momio: 41 },
      { descripcion: "7-1", momio: 51 },
      { descripcion: "8-1", momio: 101 },
      { descripcion: "9-1", momio: 251 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 51 },
      { descripcion: "6-2", momio: 81 },
      { descripcion: "7-2", momio: 151 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 251 },
      { descripcion: "6-3", momio: 401 },

      { descripcion: "0-0", momio: 23 },
      { descripcion: "1-1", momio: 21 },
      { descripcion: "2-2", momio: 41 },
      { descripcion: "3-3", momio: 126 },

      { descripcion: "0-1", momio: 41 },
      { descripcion: "0-2", momio: 101 },
      { descripcion: "0-3", momio: 501 },

      { descripcion: "1-2", momio: 51 },
      { descripcion: "1-3", momio: 201 },

      { descripcion: "2-3", momio: 126 }
    ]
  },
"belgicaegipto": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 9 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.071 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.68 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.7 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.65},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 5.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 5.22 },
        { descripcion: "3", momio: 8.98 },
        { descripcion: "4", momio: 17 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 98.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 8.38 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 43.5 },
        { descripcion: "4", momio: 143 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 13 },
      { descripcion: "4-0", momio: 26 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 126 },
      { descripcion: "7-0", momio: 401 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 451 },

      { descripcion: "3-2", momio: 29 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 9.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 401 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 29 },
      { descripcion: "0-3", momio: 67 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 19 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },
      { descripcion: "1-5", momio: 501 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 201 }
    ]
  },
"arabiasauditauruguay": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 6.5 },
      { descripcion: "2.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 1.11 },
      { descripcion: "2.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 3.25 },
      { descripcion: "3.5", momio: 7 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.33 },
      { descripcion: "3.5", momio: 1.1 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.53 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.64 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 8},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 1.44}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 10.5 },
        { descripcion: "2", momio: 25.5 },
        { descripcion: "3", momio: 75.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.48 },
        { descripcion: "2", momio: 4.29 },
        { descripcion: "3", momio: 7.16 },
        { descripcion: "4", momio: 14 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 66 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 17 },
      { descripcion: "2-0", momio: 41 },
      { descripcion: "3-0", momio: 101 },
      { descripcion: "4-0", momio: 501 },

      { descripcion: "2-1", momio: 26 },
      { descripcion: "3-1", momio: 67 },
      { descripcion: "4-1", momio: 301 },

      { descripcion: "3-2", momio: 67 },
      { descripcion: "4-2", momio: 301 },

      { descripcion: "4-3", momio: 501 },

      { descripcion: "0-0", momio: 9 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 5.5 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 9.5 },
      { descripcion: "0-4", momio: 19 },
      { descripcion: "0-5", momio: 41 },
      { descripcion: "0-6", momio: 81 },
      { descripcion: "0-7", momio: 201 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 29 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 101 },
      { descripcion: "1-7", momio: 351 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 301 },

      { descripcion: "3-4", momio: 201 },
      { descripcion: "3-5", momio: 451 }
    ]
  },
"irannuevazelanda": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 1.16 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.1 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 2.21 },
      { descripcion: "3.5", momio: 4.5 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 21 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 7 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 1.51 },
      { descripcion: "3.5", momio: 1.2 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.015 },
      { descripcion: "6.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.8},
      { descripcion: "empate", momio: 3.4},
      { descripcion: "visita", momio: 4.75}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.68 },
        { descripcion: "2", momio: 5.38 },
        { descripcion: "3", momio: 11 },
        { descripcion: "4", momio: 24 },
        { descripcion: "5", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6.97 },
        { descripcion: "2", momio: 17.22 },
        { descripcion: "3", momio: 38.12 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 15 },
      { descripcion: "4-0", momio: 34 },
      { descripcion: "5-0", momio: 67 },
      { descripcion: "6-0", momio: 201 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 201 },
      { descripcion: "5-3", momio: 201 },

      { descripcion: "0-0", momio: 7 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 19 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 151 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"franciasenegal": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.12 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 3 },
      { descripcion: "3.5", momio: 6.5 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 6 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 1.36 },
      { descripcion: "3.5", momio: 1.11 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.81 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.83 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.48},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 7}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 4.55 },
        { descripcion: "3", momio: 7.22 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.39 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7 },
      { descripcion: "3-0", momio: 10 },
      { descripcion: "4-0", momio: 21 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 81 },
      { descripcion: "7-0", momio: 201 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 26 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 101 },
      { descripcion: "7-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 201 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 17 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 351 },

      { descripcion: "1-2", momio: 21 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 201 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 301 }
    ]
  },
"iraknoruega": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.9 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.8 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.47 },
      { descripcion: "3.5", momio: 2.5 },
      { descripcion: "4.5", momio: 4.33 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.16 },
      { descripcion: "3.5", momio: 1.53 },
      { descripcion: "4.5", momio: 1.22 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 11},
      { descripcion: "empate", momio: 7.5},
      { descripcion: "visita", momio: 1.2}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 14.5 },
        { descripcion: "2", momio: 34 },
        { descripcion: "3", momio: 143 }
      ],

    diferenciaVisita: [
	{ descripcion: "1", momio: 4.46 },
        { descripcion: "2", momio: 4 },
        { descripcion: "3", momio: 5.11 },
        { descripcion: "4", momio: 8.31 },
        { descripcion: "5", momio: 14 },
        { descripcion: "6", momio: 29 },
        { descripcion: "7", momio: 53 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 26 },
      { descripcion: "2-0", momio: 51 },
      { descripcion: "3-0", momio: 201 },

      { descripcion: "2-1", momio: 34 },
      { descripcion: "3-1", momio: 101 },
      { descripcion: "4-1", momio: 501 },

      { descripcion: "3-2", momio: 81 },
      { descripcion: "4-2", momio: 401 },

      { descripcion: "4-3", momio: 451 },

      { descripcion: "0-0", momio: 17 },
      { descripcion: "1-1", momio: 15 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 7.5 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 7 },
      { descripcion: "0-4", momio: 11 },
      { descripcion: "0-5", momio: 19 },
      { descripcion: "0-6", momio: 41 },
      { descripcion: "0-7", momio: 67 },
      { descripcion: "0-8", momio: 151 },
      { descripcion: "0-9", momio: 451 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 12 },
      { descripcion: "1-4", momio: 19 },
      { descripcion: "1-5", momio: 34 },
      { descripcion: "1-6", momio: 51 },
      { descripcion: "1-7", momio: 101 },
      { descripcion: "1-8", momio: 251 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 67 },
      { descripcion: "2-6", momio: 126 },
      { descripcion: "2-7", momio: 301 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 251 },
      { descripcion: "3-6", momio: 501 }
    ]
  },
"argentinaargelia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.12 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 3 },
      { descripcion: "3.5", momio: 6.5 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 6 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 1.36 },
      { descripcion: "3.5", momio: 1.11 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.95 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.68 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.42},
      { descripcion: "empate", momio: 4.5},
      { descripcion: "visita", momio: 8}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 4.33 },
        { descripcion: "3", momio: 7.22 },
        { descripcion: "4", momio: 14 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 58 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.78 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 67 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 10 },
      { descripcion: "4-0", momio: 19 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 81 },
      { descripcion: "7-0", momio: 201 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 26 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 101 },
      { descripcion: "7-1", momio: 301 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 9 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 17 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 101 },
      { descripcion: "0-4", momio: 401 },

      { descripcion: "1-2", momio: 23 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 201 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 351 },
    ]
  },
"austriajordania": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.1 },
      { descripcion: "1.5", momio: 1.5 },
      { descripcion: "2.5", momio: 2.5 },
      { descripcion: "3.5", momio: 5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 26 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 7 },
      { descripcion: "1.5", momio: 2.5 },
      { descripcion: "2.5", momio: 1.5 },
      { descripcion: "3.5", momio: 1.16 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.01 },
      { descripcion: "6.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 2.3 },
      { descripcion: "3.5", momio: 3.2 },
      { descripcion: "4.5", momio: 5.5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 23 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 12 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 1.89 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.14 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.012 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.36},
      { descripcion: "empate", momio: 5},
      { descripcion: "visita", momio: 8.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.03 },
        { descripcion: "2", momio: 4.33 },
        { descripcion: "3", momio: 6.47 },
        { descripcion: "4", momio: 12 },
        { descripcion: "5", momio: 24 },
        { descripcion: "6", momio: 40.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 10.5 },
        { descripcion: "2", momio: 25.5 },
        { descripcion: "3", momio: 72 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 9 },
      { descripcion: "4-0", momio: 17 },
      { descripcion: "5-0", momio: 34 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 151 },
      { descripcion: "8-0", momio: 451 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 23 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 81 },
      { descripcion: "7-1", momio: 201 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 201 },
      { descripcion: "7-2", momio: 501 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 12 },
      { descripcion: "1-1", momio: 10 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 19 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 101 },
      { descripcion: "0-4", momio: 501 },

      { descripcion: "1-2", momio: 23 },
      { descripcion: "1-3", momio: 67 },
      { descripcion: "1-4", momio: 251 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 251 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"portugalrepublicademocraticadelcongo": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.25 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 21 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 1.57 },
      { descripcion: "3.5", momio: 1.2 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.015 },
      { descripcion: "6.5", momio: 1.002 }
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
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.06 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.28},
      { descripcion: "empate", momio: 5.5},
      { descripcion: "visita", momio: 11}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.12 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 5.79 },
        { descripcion: "4", momio: 9.87 },
        { descripcion: "5", momio: 18.5 },
        { descripcion: "6", momio: 38 },
        { descripcion: "7", momio: 80.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 13.5 },
        { descripcion: "2", momio: 31.5 },
        { descripcion: "3", momio: 110 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 8 },
      { descripcion: "4-0", momio: 13 },
      { descripcion: "5-0", momio: 26 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 101 },
      { descripcion: "8-0", momio: 251 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 21 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 67 },
      { descripcion: "7-1", momio: 151 },
      { descripcion: "8-1", momio: 401 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 151 },
      { descripcion: "7-2", momio: 401 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 13 },
      { descripcion: "1-1", momio: 11 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 23 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 151 },

      { descripcion: "1-2", momio: 34 },
      { descripcion: "1-3", momio: 81 },
      { descripcion: "1-4", momio: 401 },

      { descripcion: "2-3", momio: 81 },
      { descripcion: "2-4", momio: 351 },

      { descripcion: "3-4", momio: 451 }
    ]
  },
"inglaterracroacia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 4 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 1.22 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.64 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.72},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 4.75}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 5.2 },
        { descripcion: "3", momio: 9.4 },
        { descripcion: "4", momio: 20 },
        { descripcion: "5", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.03 },
        { descripcion: "2", momio: 16 },
        { descripcion: "3", momio: 36.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 13 },
      { descripcion: "4-0", momio: 29 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 151 },
      { descripcion: "7-0", momio: 501 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 34 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 151 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 351 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 12 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 }
    ]
  },
"ghanapanama": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.3 },
      { descripcion: "1.5", momio: 2.5 },
      { descripcion: "2.5", momio: 6 },
      { descripcion: "3.5", momio: 17 },
      { descripcion: "4.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.4 },
      { descripcion: "1.5", momio: 1.5 },
      { descripcion: "2.5", momio: 1.12 },
      { descripcion: "3.5", momio: 1.025 },
      { descripcion: "4.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.5 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.5 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.25},
      { descripcion: "empate", momio: 3.3},
      { descripcion: "visita", momio: 3.3}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.12 },
        { descripcion: "2", momio: 6.77 },
        { descripcion: "3", momio: 14 },
        { descripcion: "4", momio: 29 },
        { descripcion: "5", momio: 78.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.32 },
        { descripcion: "2", momio: 11.5 },
        { descripcion: "3", momio: 25.5 },
        { descripcion: "4", momio: 61 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 10 },
      { descripcion: "3-0", momio: 21 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 101 },
      { descripcion: "6-0", momio: 401 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 21 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 101 },
      { descripcion: "6-1", momio: 351 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 401 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 17 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 301 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 67 },
      { descripcion: "1-5", momio: 251 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 351 },

      { descripcion: "3-4", momio: 151 }
    ]
  },
"uzbequistancolombia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 7 },
      { descripcion: "2.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 1.1 },
      { descripcion: "2.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.11 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 2.62 },
      { descripcion: "3.5", momio: 5.5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 6.5 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 1.44 },
      { descripcion: "3.5", momio: 1.14 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.8 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.87 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 9},
      { descripcion: "empate", momio: 4.5},
      { descripcion: "visita", momio: 1.38}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 12 },
        { descripcion: "2", momio: 27 },
        { descripcion: "3", momio: 92.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.86 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 6.21 },
        { descripcion: "4", momio: 12 },
        { descripcion: "5", momio: 24 },
        { descripcion: "6", momio: 50.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 21 },
      { descripcion: "2-0", momio: 41 },
      { descripcion: "3-0", momio: 126 },

      { descripcion: "2-1", momio: 29 },
      { descripcion: "3-1", momio: 81 },
      { descripcion: "4-1", momio: 351 },

      { descripcion: "3-2", momio: 81 },
      { descripcion: "4-2", momio: 351 },

      { descripcion: "4-3", momio: 451 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 9 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 6.5 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 8.5 },
      { descripcion: "0-4", momio: 17 },
      { descripcion: "0-5", momio: 34 },
      { descripcion: "0-6", momio: 67 },
      { descripcion: "0-7", momio: 151 },
      { descripcion: "0-8", momio: 501 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 23 },
      { descripcion: "1-5", momio: 41 },
      { descripcion: "1-6", momio: 81 },
      { descripcion: "1-7", momio: 201 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 101 },
      { descripcion: "2-6", momio: 201 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"republicachecasudafrica": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 4 },
      { descripcion: "3.5", momio: 11 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 1.22 },
      { descripcion: "3.5", momio: 1.05 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.61 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.75},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 4.33}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.86 },
        { descripcion: "2", momio: 5.44 },
        { descripcion: "3", momio: 10.5 },
        { descripcion: "4", momio: 22.5 },
        { descripcion: "5", momio: 50.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6.68 },
        { descripcion: "2", momio: 14.5 },
        { descripcion: "3", momio: 36.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 15 },
      { descripcion: "4-0", momio: 34 },
      { descripcion: "5-0", momio: 67 },
      { descripcion: "6-0", momio: 151 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 34 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 201 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 401 },


      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 23 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 151 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 },
    ]
  },
"suizabosniayherzegovina": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 3.4 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 19 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 1.3 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.02 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.19 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.67 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.53},
      { descripcion: "empate", momio: 4.2},
      { descripcion: "visita", momio: 6}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 4.77 },
        { descripcion: "3", momio: 7.98 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 31 },
        { descripcion: "6", momio: 78.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 8.75 },
        { descripcion: "2", momio: 20.5 },
        { descripcion: "3", momio: 52.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7 },
      { descripcion: "3-0", momio: 11 },
      { descripcion: "4-0", momio: 21 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 101 },
      { descripcion: "7-0", momio: 251 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 351 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },


      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 81 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 34 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 301 },

      { descripcion: "1-2", momio: 21 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 151 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 301 },
    ]
  },
"canadacatar": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.25 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 21 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 1.57 },
      { descripcion: "3.5", momio: 1.2 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.015 },
      { descripcion: "6.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 2.23 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 19 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 1.97 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.02 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.28},
      { descripcion: "empate", momio: 5.75},
      { descripcion: "visita", momio: 10}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 4.22 },
        { descripcion: "3", momio: 6.05 },
        { descripcion: "4", momio: 11 },
        { descripcion: "5", momio: 18.5 },
        { descripcion: "6", momio: 38 },
        { descripcion: "7", momio: 80.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 17 },
        { descripcion: "2", momio: 29 },
        { descripcion: "3", momio: 89 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 8.5 },
      { descripcion: "4-0", momio: 15 },
      { descripcion: "5-0", momio: 26 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 101 },
      { descripcion: "8-0", momio: 301 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 21 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 67 },
      { descripcion: "7-1", momio: 151 },
      { descripcion: "8-1", momio: 401 },

      { descripcion: "3-2", momio: 29 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 151 },
      { descripcion: "7-2", momio: 351 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 201 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 11 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 81 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 23 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 126 },

      { descripcion: "1-2", momio: 29 },
      { descripcion: "1-3", momio: 67 },
      { descripcion: "1-4", momio: 301 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 251 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"mexicocoreadelsur": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 5.5 },
      { descripcion: "3.5", momio: 15 },
      { descripcion: "4.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 1.14 },
      { descripcion: "3.5", momio: 1.03 },
      { descripcion: "4.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.53 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 11 },
      { descripcion: "3.5", momio: 34 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.37 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.05 },
      { descripcion: "3.5", momio: 1.005 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.69 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.59 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.05},
      { descripcion: "empate", momio: 3.3},
      { descripcion: "visita", momio: 3.75}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.03 },
        { descripcion: "2", momio: 6.33 },
        { descripcion: "3", momio: 13 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 64 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6 },
        { descripcion: "2", momio: 13 },
        { descripcion: "3", momio: 27 },
        { descripcion: "4", momio: 75.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 9.5 },
      { descripcion: "3-0", momio: 19 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 81 },
      { descripcion: "6-0", momio: 251 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 301 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 401 },

      { descripcion: "0-1", momio: 10 },
      { descripcion: "0-2", momio: 21 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 101 },
      { descripcion: "0-5", momio: 451 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 81 },
      { descripcion: "1-5", momio: 301 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 501 },

      { descripcion: "3-4", momio: 201 }
    ]
  },
"estadosunidosaustralia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.19 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.67 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.6},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 5 },
        { descripcion: "3", momio: 8.49 },
        { descripcion: "4", momio: 16 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 80.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.37 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 46.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 12 },
      { descripcion: "4-0", momio: 23 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 101 },
      { descripcion: "7-0", momio: 351 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 401 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 13 },
      { descripcion: "0-2", momio: 29 },
      { descripcion: "0-3", momio: 67 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 151 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 }
    ]
  },
"escociamarruecos": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 4.33 },
      { descripcion: "3.5", momio: 11 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 1.2 },
      { descripcion: "3.5", momio: 1.05 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 7.5 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.6 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5.25},
      { descripcion: "empate", momio: 3.6},
      { descripcion: "visita", momio: 1.72}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 5 },
        { descripcion: "3", momio: 8.49 },
        { descripcion: "4", momio: 16 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 80.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.37 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 46.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 12 },
      { descripcion: "2-0", momio: 26 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 201 },

      { descripcion: "2-1", momio: 19 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 301 },

      { descripcion: "0-0", momio: 7.5 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 7.5 },
      { descripcion: "0-3", momio: 13 },
      { descripcion: "0-4", momio: 29 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 151 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 17 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 201 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 67 },
      { descripcion: "2-5", momio: 151 },
      { descripcion: "2-6", momio: 451 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 451 }
    ]
  },
"brasilhaiti": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.02 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.5 },
      { descripcion: "3.5", momio: 2.25 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 19 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 2.5 },
      { descripcion: "3.5", momio: 1.57 },
      { descripcion: "4.5", momio: 1.22 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.006 },
      { descripcion: "1.5", momio: 1.1 },
      { descripcion: "2.5", momio: 1.22 },
      { descripcion: "3.5", momio: 1.8 },
      { descripcion: "4.5", momio: 2.75 },
      { descripcion: "5.5", momio: 4.5 },
      { descripcion: "6.5", momio: 9 },
      { descripcion: "7.5", momio: 17 },
      { descripcion: "8.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 29 },
      { descripcion: "1.5", momio: 7 },
      { descripcion: "2.5", momio: 2.95 },
      { descripcion: "3.5", momio: 2 },
      { descripcion: "4.5", momio: 1.44 },
      { descripcion: "5.5", momio: 1.2 },
      { descripcion: "6.5", momio: 1.071 },
      { descripcion: "7.5", momio: 1.025 },
      { descripcion: "8.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.09},
      { descripcion: "empate", momio: 11},
      { descripcion: "visita", momio: 23}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6.24 },
        { descripcion: "2", momio: 4.62 },
        { descripcion: "3", momio: 4.77 },
        { descripcion: "4", momio: 6.05 },
        { descripcion: "5", momio: 9.4 },
        { descripcion: "6", momio: 15 },
        { descripcion: "7", momio: 29 },
        { descripcion: "8", momio: 50.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 20.5 },
        { descripcion: "2", momio: 60.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 12 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 8.5 },
      { descripcion: "5-0", momio: 13 },
      { descripcion: "6-0", momio: 21 },
      { descripcion: "7-0", momio: 41 },
      { descripcion: "8-0", momio: 67 },
      { descripcion: "9-0", momio: 151 },
      { descripcion: "10-0", momio: 351 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 15 },
      { descripcion: "5-1", momio: 21 },
      { descripcion: "6-1", momio: 34 },
      { descripcion: "7-1", momio: 51 },
      { descripcion: "8-1", momio: 101 },
      { descripcion: "9-1", momio: 201 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 51 },
      { descripcion: "6-2", momio: 81 },
      { descripcion: "7-2", momio: 126 },
      { descripcion: "8-2", momio: 251 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 151 },
      { descripcion: "6-3", momio: 301 },
      { descripcion: "7-3", momio: 501 },

      { descripcion: "0-0", momio: 29 },
      { descripcion: "1-1", momio: 21 },
      { descripcion: "2-2", momio: 41 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 41 },
      { descripcion: "0-2", momio: 101 },
      { descripcion: "0-3", momio: 401 },

      { descripcion: "1-2", momio: 41 },
      { descripcion: "1-3", momio: 151 },

      { descripcion: "2-3", momio: 101 },
      { descripcion: "2-4", momio: 501 },

      { descripcion: "3-4", momio: 501 }
    ]
  },
"turquiaparaguay": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 1.16 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.5 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 11 },
      { descripcion: "3.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.5 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 1.05 },
      { descripcion: "3.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.64 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2},
      { descripcion: "empate", momio: 3.4},
      { descripcion: "visita", momio: 3.9}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.03 },
        { descripcion: "2", momio: 6.33 },
        { descripcion: "3", momio: 13 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 6.35 },
        { descripcion: "2", momio: 13 },
        { descripcion: "3", momio: 27 },
        { descripcion: "4", momio: 75.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 9.5 },
      { descripcion: "3-0", momio: 19 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 81 },
      { descripcion: "6-0", momio: 251 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 401 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 21 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 101 },
      { descripcion: "0-5", momio: 451 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 81 },
      { descripcion: "1-5", momio: 301 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 401 },

      { descripcion: "3-4", momio: 201 }
    ]
  },
"paisesbajossuecia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 3.4 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 19 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 1.3 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.02 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.96 },
      { descripcion: "3.5", momio: 3 },
      { descripcion: "4.5", momio: 5.5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 23 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 12 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 1.96 },
      { descripcion: "3.5", momio: 1.4 },
      { descripcion: "4.5", momio: 1.14 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.012 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.75},
      { descripcion: "empate", momio: 4},
      { descripcion: "visita", momio: 4.33}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.24 },
        { descripcion: "2", momio: 5.63 },
        { descripcion: "3", momio: 9.89 },
        { descripcion: "4", momio: 18.5 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 96 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.5 },
        { descripcion: "2", momio: 16 },
        { descripcion: "3", momio: 31.5 },
        { descripcion: "4", momio: 89 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 9 },
      { descripcion: "3-0", momio: 15 },
      { descripcion: "4-0", momio: 29 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 126 },
      { descripcion: "7-0", momio: 401 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 401 },

      { descripcion: "3-2", momio: 26 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 201 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 201 },

      { descripcion: "0-0", momio: 12 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 251 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 126 },
      { descripcion: "0-5", momio: 501 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 81 },
      { descripcion: "1-5", momio: 301 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 301 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 501 }
    ]
  },
"alemaniacostademarfil": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.11 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 6.5 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 1.4 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 34 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.005 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.06 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.53},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 5.75}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.12 },
        { descripcion: "2", momio: 4.95 },
        { descripcion: "3", momio: 7.89 },
        { descripcion: "4", momio: 14 },
        { descripcion: "5", momio: 27 },
        { descripcion: "6", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 8.97 },
        { descripcion: "2", momio: 18.5 },
        { descripcion: "3", momio: 40.5 },
        { descripcion: "4", momio: 139 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 12 },
      { descripcion: "4-0", momio: 21 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 81 },
      { descripcion: "7-0", momio: 201 },

      { descripcion: "2-1", momio: 8.5 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 23 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 81 },
      { descripcion: "7-1", momio: 251 },

      { descripcion: "3-2", momio: 26 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 151 },
      { descripcion: "7-2", momio: 451 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 151 },
      { descripcion: "6-3", momio: 451 },

      { descripcion: "0-0", momio: 13 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 251 },

      { descripcion: "0-1", momio: 17 },
      { descripcion: "0-2", momio: 34 },
      { descripcion: "0-3", momio: 67 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 19 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 451 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 451 },

      { descripcion: "3-4", momio: 151 }
    ]
  },
"ecuadorcurazao": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.72 },
      { descripcion: "3.5", momio: 3 },
      { descripcion: "4.5", momio: 5.5 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.14 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 3.5 },
      { descripcion: "1.5", momio: 19 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.28 },
      { descripcion: "1.5", momio: 1.02 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.73 },
      { descripcion: "3.5", momio: 2.5 },
      { descripcion: "4.5", momio: 4.5 },
      { descripcion: "5.5", momio: 9 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 2.11 },
      { descripcion: "3.5", momio: 1.53 },
      { descripcion: "4.5", momio: 1.2 },
      { descripcion: "5.5", momio: 1.071 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.09},
      { descripcion: "empate", momio: 11},
      { descripcion: "visita", momio: 21}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.77 },
        { descripcion: "2", momio: 3.86 },
        { descripcion: "3", momio: 4.44 },
        { descripcion: "4", momio: 6.14 },
        { descripcion: "5", momio: 10.5 },
        { descripcion: "6", momio: 18.5 },
        { descripcion: "7", momio: 34 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 25.5 },
        { descripcion: "2", momio: 96 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 5 },
      { descripcion: "3-0", momio: 5.5 },
      { descripcion: "4-0", momio: 7.5 },
      { descripcion: "5-0", momio: 13 },
      { descripcion: "6-0", momio: 23 },
      { descripcion: "7-0", momio: 41 },
      { descripcion: "8-0", momio: 81 },
      { descripcion: "9-0", momio: 201 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 23 },
      { descripcion: "5-1", momio: 34 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 201 },

      { descripcion: "3-2", momio: 67 },
      { descripcion: "4-2", momio: 81 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 201 },
      { descripcion: "7-2", momio: 501 },

      { descripcion: "4-3", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 23 },
      { descripcion: "2-2", momio: 67 },
      { descripcion: "3-3", momio: 401 },

      { descripcion: "0-1", momio: 41 },
      { descripcion: "0-2", momio: 126 },
      { descripcion: "0-3", momio: 501 },

      { descripcion: "1-2", momio: 67 },
      { descripcion: "1-3", momio: 401 },

      { descripcion: "2-3", momio: 301 }
    ]
  },
"tunezjapon": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.64 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 7},
      { descripcion: "empate", momio: 4},
      { descripcion: "visita", momio: 1.53}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 9.08 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.48 },
        { descripcion: "2", momio: 4.53 },
        { descripcion: "3", momio: 7.98 },
        { descripcion: "4", momio: 16 },
        { descripcion: "5", momio: 31 },
        { descripcion: "6", momio: 82.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 15 },
      { descripcion: "2-0", momio: 34 },
      { descripcion: "3-0", momio: 81 },
      { descripcion: "4-0", momio: 401 },

      { descripcion: "2-1", momio: 23 },
      { descripcion: "3-1", momio: 67 },
      { descripcion: "4-1", momio: 251 },

      { descripcion: "3-2", momio: 67 },
      { descripcion: "4-2", momio: 251 },

      { descripcion: "4-3", momio: 401 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 5.5 },
      { descripcion: "0-2", momio: 6.5 },
      { descripcion: "0-3", momio: 11 },
      { descripcion: "0-4", momio: 23 },
      { descripcion: "0-5", momio: 41 },
      { descripcion: "0-6", momio: 101 },
      { descripcion: "0-7", momio: 301 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 29 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 126 },
      { descripcion: "1-7", momio: 451 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 451 }
    ]
  },
"espanaarabiasaudita": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.66 },
      { descripcion: "3.5", momio: 2.62 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.1 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 15 },
      { descripcion: "2.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 1.03 },
      { descripcion: "2.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.02 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.3 },
      { descripcion: "3.5", momio: 2.2 },
      { descripcion: "4.5", momio: 3.75 },
      { descripcion: "5.5", momio: 6.5 },
      { descripcion: "6.5", momio: 13 },
      { descripcion: "7.5", momio: 26 },
      { descripcion: "8.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 19 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 2.45 },
      { descripcion: "3.5", momio: 1.66 },
      { descripcion: "4.5", momio: 1.28 },
      { descripcion: "5.5", momio: 1.11 },
      { descripcion: "6.5", momio: 1.04 },
      { descripcion: "7.5", momio: 1.01 },
      { descripcion: "8.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.09},
      { descripcion: "empate", momio: 10},
      { descripcion: "visita", momio: 23}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 5.22 },
        { descripcion: "2", momio: 4.02 },
        { descripcion: "3", momio: 4.27 },
        { descripcion: "4", momio: 5.96 },
        { descripcion: "5", momio: 9.28 },
        { descripcion: "6", momio: 18 },
        { descripcion: "7", momio: 32 },
        { descripcion: "8", momio: 67.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 25.5 },
        { descripcion: "2", momio: 89 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 5.5 },
      { descripcion: "3-0", momio: 5.5 },
      { descripcion: "4-0", momio: 7.5 },
      { descripcion: "5-0", momio: 12 },
      { descripcion: "6-0", momio: 23 },
      { descripcion: "7-0", momio: 41 },
      { descripcion: "8-0", momio: 81 },
      { descripcion: "9-0", momio: 151 },
      { descripcion: "10-0", momio: 501 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 29 },
      { descripcion: "6-1", momio: 41 },
      { descripcion: "7-1", momio: 81 },
      { descripcion: "8-1", momio: 151 },
      { descripcion: "9-1", momio: 401 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 151 },
      { descripcion: "7-2", momio: 301 },

      { descripcion: "4-3", momio: 301 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 17 },
      { descripcion: "1-1", momio: 21 },
      { descripcion: "2-2", momio: 51 },
      { descripcion: "3-3", momio: 201 },

      { descripcion: "0-1", momio: 41 },
      { descripcion: "0-2", momio: 126 },
      { descripcion: "0-3", momio: 501 },

      { descripcion: "1-2", momio: 67 },
      { descripcion: "1-3", momio: 301 },

      { descripcion: "2-3", momio: 201 }
    ]
  },
"belgicairan": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.11 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 6.5 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 1.4 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 19 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.02 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.47 },
      { descripcion: "3.5", momio: 3.2 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.88 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.44},
      { descripcion: "empate", momio: 4.75},
      { descripcion: "visita", momio: 7}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 4.33 },
        { descripcion: "3", momio: 6.72 },
        { descripcion: "4", momio: 13 },
        { descripcion: "5", momio: 27 },
        { descripcion: "6", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.39 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 9.5 },
      { descripcion: "4-0", momio: 19 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 67 },
      { descripcion: "7-0", momio: 201 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 23 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 81 },
      { descripcion: "7-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 201 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 9 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 81 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 17 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 351 },

      { descripcion: "1-2", momio: 21 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 201 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 301 }
    ]
  },
"uruguaycaboverde": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 3.25 },
      { descripcion: "3.5", momio: 7 },
      { descripcion: "4.5", momio: 19 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.33 },
      { descripcion: "3.5", momio: 1.1 },
      { descripcion: "4.5", momio: 1.02 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.48},
      { descripcion: "empate", momio: 4.1},
      { descripcion: "visita", momio: 7.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.48 },
        { descripcion: "2", momio: 4.29 },
        { descripcion: "3", momio: 7.73 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 32 },
        { descripcion: "6", momio: 82.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.51 },
        { descripcion: "2", momio: 25.5 },
        { descripcion: "3", momio: 75.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 5.5 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 10 },
      { descripcion: "4-0", momio: 21 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 101 },
      { descripcion: "7-0", momio: 301 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 34 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 151 },
      { descripcion: "7-1", momio: 451 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 401 },

      { descripcion: "4-3", momio: 201 },
      { descripcion: "5-3", momio: 501 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 28 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 101 },
      { descripcion: "0-4", momio: 501 },

      { descripcion: "1-2", momio: 26 },
      { descripcion: "1-3", momio: 67 },
      { descripcion: "1-4", momio: 301 },

      { descripcion: "2-3", momio: 81 },
      { descripcion: "2-4", momio: 351 },

      { descripcion: "3-4", momio: 501 }
    ]
  },
"nuevazelandaegipto": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 19 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.02 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.69 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5.5},
      { descripcion: "empate", momio: 4},
      { descripcion: "visita", momio: 1.6}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.35 },
        { descripcion: "2", momio: 18.5 },
        { descripcion: "3", momio: 46.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.1 },
        { descripcion: "2", momio: 4.96 },
        { descripcion: "3", momio: 8.87 },
        { descripcion: "4", momio: 18.5 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 101 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 12 },
      { descripcion: "2-0", momio: 29 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 251 },

      { descripcion: "2-1", momio: 19 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 201 },

      { descripcion: "4-3", momio: 351 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 7 },
      { descripcion: "0-3", momio: 12 },
      { descripcion: "0-4", momio: 26 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 126 },
      { descripcion: "0-7", momio: 401 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 17 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 401 }
    ]
  },
"argentinaaustria": {

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
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 19 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.02 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.68 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.7 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.5},
      { descripcion: "empate", momio: 4.1},
      { descripcion: "visita", momio: 7}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 4.55 },
        { descripcion: "3", momio: 7.73 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 64 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.39 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 7 },
      { descripcion: "3-0", momio: 11 },
      { descripcion: "4-0", momio: 21 },
      { descripcion: "5-0", momio: 41 },
      { descripcion: "6-0", momio: 81 },
      { descripcion: "7-0", momio: 251 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 13 },
      { descripcion: "4-1", momio: 26 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 101 },
      { descripcion: "7-1", momio: 301 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },

      { descripcion: "4-3", momio: 301 },
      { descripcion: "5-3", momio: 126 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 17 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 301 },

      { descripcion: "1-2", momio: 21 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 201 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 301 }
    ]
  },
"franciairak": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.02 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.5 },
      { descripcion: "3.5", momio: 2.2 },
      { descripcion: "4.5", momio: 3.75 },
      { descripcion: "5.5", momio: 7 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 29 },
      { descripcion: "8.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 19 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 2.5 },
      { descripcion: "3.5", momio: 1.61 },
      { descripcion: "4.5", momio: 1.25 },
      { descripcion: "5.5", momio: 1.1 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.006 },
      { descripcion: "8.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 13 },
      { descripcion: "2.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 1.04 },
      { descripcion: "2.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.015 },
      { descripcion: "1.5", momio: 1.1 },
      { descripcion: "2.5", momio: 1.24 },
      { descripcion: "3.5", momio: 1.9 },
      { descripcion: "4.5", momio: 3 },
      { descripcion: "5.5", momio: 5 },
      { descripcion: "6.5", momio: 10 },
      { descripcion: "7.5", momio: 19 },
      { descripcion: "8.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 21 },
      { descripcion: "1.5", momio: 7 },
      { descripcion: "2.5", momio: 2.93 },
      { descripcion: "3.5", momio: 1.9 },
      { descripcion: "4.5", momio: 1.4 },
      { descripcion: "5.5", momio: 1.16 },
      { descripcion: "6.5", momio: 1.062 },
      { descripcion: "7.5", momio: 1.02 },
      { descripcion: "8.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.062},
      { descripcion: "empate", momio: 12},
      { descripcion: "visita", momio: 34}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6 },
        { descripcion: "2", momio: 4.53 },
        { descripcion: "3", momio: 4.43 },
        { descripcion: "4", momio: 5.37 },
        { descripcion: "5", momio: 8.67 },
        { descripcion: "6", momio: 14 },
        { descripcion: "7", momio: 25.5 },
        { descripcion: "8", momio: 42.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 29 },
        { descripcion: "2", momio: 106 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 10 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 6 },
      { descripcion: "4-0", momio: 7 },
      { descripcion: "5-0", momio: 11 },
      { descripcion: "6-0", momio: 19 },
      { descripcion: "7-0", momio: 34 },
      { descripcion: "8-0", momio: 51 },
      { descripcion: "9-0", momio: 126 },
      { descripcion: "10-0", momio: 301 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 17 },
      { descripcion: "5-1", momio: 23 },
      { descripcion: "6-1", momio: 41 },
      { descripcion: "7-1", momio: 51 },
      { descripcion: "8-1", momio: 101 },
      { descripcion: "9-1", momio: 251 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 101 },
      { descripcion: "7-2", momio: 201 },

      { descripcion: "4-3", momio: 251 },
      { descripcion: "5-3", momio: 351 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 21 },
      { descripcion: "1-1", momio: 23 },
      { descripcion: "2-2", momio: 51 },
      { descripcion: "3-3", momio: 201 },

      { descripcion: "0-1", momio: 51 },
      { descripcion: "0-2", momio: 151 },
      { descripcion: "0-3", momio: 501 },

      { descripcion: "1-2", momio: 67 },
      { descripcion: "1-3", momio: 351 },

      { descripcion: "2-3", momio: 201 }
    ]
  },
"noruegasenegal": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.22 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 4.5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 1.18 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.47 },
      { descripcion: "3.5", momio: 3.2 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.88 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.2},
      { descripcion: "empate", momio: 3.5},
      { descripcion: "visita", momio: 3.25}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.62 },
        { descripcion: "2", momio: 7.35 },
        { descripcion: "3", momio: 14 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 72 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.74 },
        { descripcion: "2", momio: 11 },
        { descripcion: "3", momio: 22.5 },
        { descripcion: "4", momio: 46.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 9 },
      { descripcion: "2-0", momio: 12 },
      { descripcion: "3-0", momio: 21 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 101 },
      { descripcion: "6-0", momio: 301 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 26 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 351 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 13 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 67 },
      { descripcion: "0-5", momio: 201 },

      { descripcion: "1-2", momio: 12 },
      { descripcion: "1-3", momio: 26 },
      { descripcion: "1-4", momio: 51 },
      { descripcion: "1-5", momio: 151 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 67 },
      { descripcion: "2-5", momio: 201 },

      { descripcion: "3-4", momio: 101 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"jordaniaargelia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.12 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 3 },
      { descripcion: "3.5", momio: 7 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 6 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.36 },
      { descripcion: "3.5", momio: 1.1 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2.81 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.74 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 6},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 1.53}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 8.75 },
        { descripcion: "2", momio: 20.5 },
        { descripcion: "3", momio: 52.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 4.55 },
        { descripcion: "3", momio: 7.73 },
        { descripcion: "4", momio: 15 },
        { descripcion: "5", momio: 29 },
        { descripcion: "6", momio: 64 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 15 },
      { descripcion: "2-0", momio: 34 },
      { descripcion: "3-0", momio: 81 },
      { descripcion: "4-0", momio: 251 },

      { descripcion: "2-1", momio: 21 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 251 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 451 },

      { descripcion: "0-1", momio: 7 },
      { descripcion: "0-2", momio: 7 },
      { descripcion: "0-3", momio: 11 },
      { descripcion: "0-4", momio: 21 },
      { descripcion: "0-5", momio: 41 },
      { descripcion: "0-6", momio: 81 },
      { descripcion: "0-7", momio: 251 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 26 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 101 },
      { descripcion: "1-7", momio: 301 },

      { descripcion: "2-3", momio: 29 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 201 },

      { descripcion: "3-4", momio: 101 },
      { descripcion: "3-5", momio: 251 }
    ]
  },
"portugaluzbequistan": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.9 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.8 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.48 },
      { descripcion: "3.5", momio: 2.37 },
      { descripcion: "4.5", momio: 4.33 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.23 },
      { descripcion: "3.5", momio: 1.57 },
      { descripcion: "4.5", momio: 1.22 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.18},
      { descripcion: "empate", momio: 7},
      { descripcion: "visita", momio: 15}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.63 },
        { descripcion: "2", momio: 4 },
        { descripcion: "3", momio: 5.12 },
        { descripcion: "4", momio: 7.44 },
        { descripcion: "5", momio: 14 },
        { descripcion: "6", momio: 25.5 },
        { descripcion: "7", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 17 },
        { descripcion: "2", momio: 40.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 10 },
      { descripcion: "5-0", momio: 19 },
      { descripcion: "6-0", momio: 34 },
      { descripcion: "7-0", momio: 67 },
      { descripcion: "8-0", momio: 151 },
      { descripcion: "9-0", momio: 401 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 29 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 251 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 126 },
      { descripcion: "7-2", momio: 301 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 251 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 13 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 29 },
      { descripcion: "0-2", momio: 67 },
      { descripcion: "0-3", momio: 251 },

      { descripcion: "1-2", momio: 41 },
      { descripcion: "1-3", momio: 101 },

      { descripcion: "2-3", momio: 101 },
      { descripcion: "2-4", momio: 501 },

      { descripcion: "3-4", momio: 501 }
    ]
  },
"inglaterraghana": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.25 },
      { descripcion: "2.5", momio: 1.72 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.97 },
      { descripcion: "3.5", momio: 2.5 },
      { descripcion: "4.5", momio: 4.5 },
      { descripcion: "5.5", momio: 9 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 2.11 },
      { descripcion: "3.5", momio: 1.53 },
      { descripcion: "4.5", momio: 1.2 },
      { descripcion: "5.5", momio: 1.071 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.2},
      { descripcion: "empate", momio: 7},
      { descripcion: "visita", momio: 13}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.46 },
        { descripcion: "2", momio: 4 },
        { descripcion: "3", momio: 5.12 },
        { descripcion: "4", momio: 8.3 },
        { descripcion: "5", momio: 15 },
        { descripcion: "6", momio: 29 },
        { descripcion: "7", momio: 55 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 13.5 },
        { descripcion: "2", momio: 34 },
        { descripcion: "3", momio: 139 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 11 },
      { descripcion: "5-0", momio: 21 },
      { descripcion: "6-0", momio: 41 },
      { descripcion: "7-0", momio: 67 },
      { descripcion: "8-0", momio: 151 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 34 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 301 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 126 },
      { descripcion: "7-2", momio: 301 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 251 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 13 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 23 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 201 },

      { descripcion: "1-2", momio: 34 },
      { descripcion: "1-3", momio: 101 },
      { descripcion: "1-4", momio: 451 },

      { descripcion: "2-3", momio: 81 },
      { descripcion: "2-4", momio: 401 },

      { descripcion: "3-4", momio: 451 }
    ]
  },
"panamacroacia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.11 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 6.5 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 1.4 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.96 },
      { descripcion: "3.5", momio: 3 },
      { descripcion: "4.5", momio: 5.5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 23 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 12 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 1.96 },
      { descripcion: "3.5", momio: 1.4 },
      { descripcion: "4.5", momio: 1.14 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.012 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 7},
      { descripcion: "empate", momio: 4.33},
      { descripcion: "visita", momio: 1.48}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 9.98 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 52.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.09 },
        { descripcion: "2", momio: 4.76 },
        { descripcion: "3", momio: 7.44 },
        { descripcion: "4", momio: 14 },
        { descripcion: "5", momio: 27 },
        { descripcion: "6", momio: 61 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 19 },
      { descripcion: "2-0", momio: 41 },
      { descripcion: "3-0", momio: 81 },
      { descripcion: "4-0", momio: 301 },

      { descripcion: "2-1", momio: 21 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 201 },

      { descripcion: "0-0", momio: 12 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 351 },

      { descripcion: "0-1", momio: 7.5 },
      { descripcion: "0-2", momio: 7.5 },
      { descripcion: "0-3", momio: 11 },
      { descripcion: "0-4", momio: 21 },
      { descripcion: "0-5", momio: 41 },
      { descripcion: "0-6", momio: 81 },
      { descripcion: "0-7", momio: 201 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 23 },
      { descripcion: "1-5", momio: 41 },
      { descripcion: "1-6", momio: 81 },
      { descripcion: "1-7", momio: 251 },

      { descripcion: "2-3", momio: 29 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 151 },
      { descripcion: "2-7", momio: 501 },

      { descripcion: "3-4", momio: 101 },
      { descripcion: "3-5", momio: 201 },
      { descripcion: "3-6", momio: 501 }
    ]
  },
"colombiarepublicademocraticadelcongo": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.13 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 9 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 1.22 },
      { descripcion: "4.5", momio: 1.071 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.55},
      { descripcion: "empate", momio: 4},
      { descripcion: "visita", momio: 6.25}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.48 },
        { descripcion: "2", momio: 4.7 },
        { descripcion: "3", momio: 8.31 },
        { descripcion: "4", momio: 17 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 101 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 8.03 },
        { descripcion: "2", momio: 20.5 },
        { descripcion: "3", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 5.5 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 11 },
      { descripcion: "4-0", momio: 23 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 126 },
      { descripcion: "7-0", momio: 401 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 34 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 151 },
      { descripcion: "7-1", momio: 501 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 401 },

      { descripcion: "4-3", momio: 201 },
      { descripcion: "5-3", momio: 501 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 9.5 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 13 },
      { descripcion: "0-2", momio: 34 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 351 },

      { descripcion: "1-2", momio: 21 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 201 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 251 },

      { descripcion: "3-4", momio: 401 }
    ]
  },
"suizacanada": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 5.5 },
      { descripcion: "3.5", momio: 15 },
      { descripcion: "4.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 1.14 },
      { descripcion: "3.5", momio: 1.03 },
      { descripcion: "4.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 8 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.083 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.53 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8.5 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.74 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.1},
      { descripcion: "empate", momio: 3.1},
      { descripcion: "visita", momio: 3.3}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.44 },
        { descripcion: "2", momio: 7.64 },
        { descripcion: "3", momio: 14.5 },
        { descripcion: "4", momio: 34 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.65 },
        { descripcion: "2", momio: 10.5 },
        { descripcion: "3", momio: 20.5 },
        { descripcion: "4", momio: 52.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 12 },
      { descripcion: "3-0", momio: 23 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 101 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 21 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 101 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 151 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 6 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 251 },

      { descripcion: "0-1", momio: 10 },
      { descripcion: "0-2", momio: 17 },
      { descripcion: "0-3", momio: 34 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 251 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 29 },
      { descripcion: "1-4", momio: 51 },
      { descripcion: "1-5", momio: 151 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 251 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 501 }
    ]
  },
"bosniayherzegovinacatar": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 2.25 },
      { descripcion: "3.5", momio: 4.33 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 21 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 1.57 },
      { descripcion: "3.5", momio: 1.2 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.015 },
      { descripcion: "6.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.47 },
      { descripcion: "3.5", momio: 2.5 },
      { descripcion: "4.5", momio: 4.33 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 17 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.26 },
      { descripcion: "3.5", momio: 1.53 },
      { descripcion: "4.5", momio: 1.22 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.025 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.4},
      { descripcion: "empate", momio: 5},
      { descripcion: "visita", momio: 7.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.5 },
        { descripcion: "2", momio: 4.62 },
        { descripcion: "3", momio: 6.55 },
        { descripcion: "4", momio: 11.5 },
        { descripcion: "5", momio: 22.5 },
        { descripcion: "6", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 11 },
        { descripcion: "2", momio: 22.5 },
        { descripcion: "3", momio: 52.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 9 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 10 },
      { descripcion: "4-0", momio: 17 },
      { descripcion: "5-0", momio: 34 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 126 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 34 },
      { descripcion: "6-1", momio: 67 },
      { descripcion: "7-1", momio: 151 },

      { descripcion: "3-2", momio: 26 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 51 },
      { descripcion: "6-2", momio: 126 },
      { descripcion: "7-2", momio: 301 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 151 },
      { descripcion: "6-3", momio: 351 },

      { descripcion: "5-4", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 9.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 251 },

      { descripcion: "0-1", momio: 21 },
      { descripcion: "0-2", momio: 41 },
      { descripcion: "0-3", momio: 81 },
      { descripcion: "0-4", momio: 301 },

      { descripcion: "1-2", momio: 23 },
      { descripcion: "1-3", momio: 51 },
      { descripcion: "1-4", momio: 151 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 151 }
    ]
  },
"escociabrasil": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 6.5 },
      { descripcion: "2.5", momio: 23 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 1.11 },
      { descripcion: "2.5", momio: 1.012 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.1 },
      { descripcion: "1.5", momio: 1.53 },
      { descripcion: "2.5", momio: 2.62 },
      { descripcion: "3.5", momio: 5.5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 7 },
      { descripcion: "1.5", momio: 2.37 },
      { descripcion: "2.5", momio: 1.44 },
      { descripcion: "3.5", momio: 1.14 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.47 },
      { descripcion: "3.5", momio: 3.2 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.88 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 8.5},
      { descripcion: "empate", momio: 5},
      { descripcion: "visita", momio: 1.33}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 12 },
        { descripcion: "2", momio: 27 },
        { descripcion: "3", momio: 92.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.6 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 6.21 },
        { descripcion: "4", momio: 11 },
        { descripcion: "5", momio: 24 },
        { descripcion: "6", momio: 40.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 21 },
      { descripcion: "2-0", momio: 41 },
      { descripcion: "3-0", momio: 126 },

      { descripcion: "2-1", momio: 29 },
      { descripcion: "3-1", momio: 81 },
      { descripcion: "4-1", momio: 351 },

      { descripcion: "3-2", momio: 67 },
      { descripcion: "4-2", momio: 301 },

      { descripcion: "4-3", momio: 451 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 10 },
      { descripcion: "2-2", momio: 26 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 8.5 },
      { descripcion: "0-4", momio: 15 },
      { descripcion: "0-5", momio: 34 },
      { descripcion: "0-6", momio: 51 },
      { descripcion: "0-7", momio: 151 },
      { descripcion: "0-8", momio: 451 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 23 },
      { descripcion: "1-5", momio: 41 },
      { descripcion: "1-6", momio: 81 },
      { descripcion: "1-7", momio: 201 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 201 },
      { descripcion: "2-7", momio: 501 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 301 },
    ]
  },
"marruecoshaiti": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 1.83 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.83 },
      { descripcion: "3.5", momio: 1.3 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 9 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 1.071 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.48 },
      { descripcion: "3.5", momio: 2.3 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 7 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.26 },
      { descripcion: "3.5", momio: 1.61 },
      { descripcion: "4.5", momio: 1.25 },
      { descripcion: "5.5", momio: 1.1 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.18},
      { descripcion: "empate", momio: 7},
      { descripcion: "visita", momio: 15}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.63 },
        { descripcion: "2", momio: 4 },
        { descripcion: "3", momio: 5.12 },
        { descripcion: "4", momio: 7.44 },
        { descripcion: "5", momio: 14 },
        { descripcion: "6", momio: 29 },
        { descripcion: "7", momio: 50.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 18.5 },
        { descripcion: "2", momio: 49.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 6 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 10 },
      { descripcion: "5-0", momio: 19 },
      { descripcion: "6-0", momio: 34 },
      { descripcion: "7-0", momio: 67 },
      { descripcion: "8-0", momio: 126 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 29 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 201 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 126 },
      { descripcion: "7-2", momio: 251 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 251 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 13 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 34 },
      { descripcion: "0-2", momio: 81 },
      { descripcion: "0-3", momio: 301 },

      { descripcion: "1-2", momio: 41 },
      { descripcion: "1-3", momio: 126 },

      { descripcion: "2-3", momio: 101 },
      { descripcion: "2-4", momio: 501 }
    ]
  },
"republicachecamexico": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.5 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.5 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 4.5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 29 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 1.18 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.006 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.54 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.5},
      { descripcion: "empate", momio: 3.9},
      { descripcion: "visita", momio: 1.95}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 5.65 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 27 },
        { descripcion: "4", momio: 75.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.03 },
        { descripcion: "2", momio: 6.11 },
        { descripcion: "3", momio: 12 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 61 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 10 },
      { descripcion: "2-0", momio: 19 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 101 },
      { descripcion: "5-0", momio: 401 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 34 },
      { descripcion: "4-1", momio: 81 },
      { descripcion: "5-1", momio: 301 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 101 },
      { descripcion: "5-2", momio: 351 },

      { descripcion: "4-3", momio: 151 },

      { descripcion: "0-0", momio: 9.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 451 },

      { descripcion: "0-1", momio: 7 },
      { descripcion: "0-2", momio: 9 },
      { descripcion: "0-3", momio: 17 },
      { descripcion: "0-4", momio: 41 },
      { descripcion: "0-5", momio: 81 },
      { descripcion: "0-6", momio: 251 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 19 },
      { descripcion: "1-4", momio: 41 },
      { descripcion: "1-5", momio: 81 },
      { descripcion: "1-6", momio: 251 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 451 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"sudafricacoreadelsur": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 22 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.01 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.65 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5.25},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 1.66}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.72 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 43.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.77 },
        { descripcion: "2", momio: 5 },
        { descripcion: "3", momio: 9.4 },
        { descripcion: "4", momio: 20 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 101 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 29 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 201 },

      { descripcion: "2-1", momio: 19 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 126 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 251 },

      { descripcion: "0-0", momio: 9 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 6.5 },
      { descripcion: "0-2", momio: 7.5 },
      { descripcion: "0-3", momio: 13 },
      { descripcion: "0-4", momio: 29 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 126 },
      { descripcion: "0-7", momio: 451 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"curazaocostademarfil": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 9 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 1.071 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.25 },
      { descripcion: "2.5", momio: 1.8 },
      { descripcion: "3.5", momio: 3 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.9 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.48 },
      { descripcion: "3.5", momio: 2.3 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 7 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 26 },
      { descripcion: "8.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 1.61 },
      { descripcion: "4.5", momio: 1.25 },
      { descripcion: "5.5", momio: 1.1 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.01 },
      { descripcion: "8.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 17},
      { descripcion: "empate", momio: 8.5},
      { descripcion: "visita", momio: 1.14}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 18.5 },
        { descripcion: "2", momio: 49.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.79 },
        { descripcion: "2", momio: 4 },
        { descripcion: "3", momio: 4.7 },
        { descripcion: "4", momio: 7.16 },
        { descripcion: "5", momio: 13 },
        { descripcion: "6", momio: 21.5 },
        { descripcion: "7", momio: 40.5 },
        { descripcion: "8", momio: 84 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 34 },
      { descripcion: "2-0", momio: 81 },
      { descripcion: "3-0", momio: 301 },

      { descripcion: "2-1", momio: 41 },
      { descripcion: "3-1", momio: 126 },

      { descripcion: "3-2", momio: 101 },

      { descripcion: "0-0", momio: 17 },
      { descripcion: "1-1", momio: 15 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 6.5 },
      { descripcion: "0-4", momio: 9.5 },
      { descripcion: "0-5", momio: 17 },
      { descripcion: "0-6", momio: 29 },
      { descripcion: "0-7", momio: 51 },
      { descripcion: "0-8", momio: 101 },
      { descripcion: "0-9", momio: 301 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 12 },
      { descripcion: "1-4", momio: 17 },
      { descripcion: "1-5", momio: 29 },
      { descripcion: "1-6", momio: 51 },
      { descripcion: "1-7", momio: 81 },
      { descripcion: "1-8", momio: 201 },
      { descripcion: "1-9", momio: 501 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 67 },
      { descripcion: "2-6", momio: 101 },
      { descripcion: "2-7", momio: 251 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 251 },
      { descripcion: "3-6", momio: 501 }
    ]
  },
"ecuadoralemania": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 8 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.083 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 19 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.02 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 1.97 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.75},
      { descripcion: "empate", momio: 4.2},
      { descripcion: "visita", momio: 1.83}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6.5 },
        { descripcion: "2", momio: 13 },
        { descripcion: "3", momio: 25.5 },
        { descripcion: "4", momio: 67 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.5 },
        { descripcion: "2", momio: 6 },
        { descripcion: "3", momio: 10.5 },
        { descripcion: "4", momio: 20.5 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 110 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 23 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 101 },
      { descripcion: "5-0", momio: 351 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 29 },
      { descripcion: "4-1", momio: 67 },
      { descripcion: "5-1", momio: 201 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 10 },
      { descripcion: "0-3", momio: 17 },
      { descripcion: "0-4", momio: 34 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 151 },
      { descripcion: "0-7", momio: 451 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 29 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 126 },
      { descripcion: "1-7", momio: 401 },

      { descripcion: "2-3", momio: 23 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 201 },

      { descripcion: "3-4", momio: 81 },
      { descripcion: "3-5", momio: 151 },
      { descripcion: "3-6", momio: 501 },

      { descripcion: "4-5", momio: 501 }
    ]
  },
"japonsuecia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 3.4 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 19 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 1.3 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.02 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 9 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.071 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 12 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.11 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.85},
      { descripcion: "empate", momio: 3.5},
      { descripcion: "visita", momio: 4.33}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.5 },
        { descripcion: "2", momio: 6 },
        { descripcion: "3", momio: 10.5 },
        { descripcion: "4", momio: 20.5 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 110 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.5 },
        { descripcion: "2", momio: 14.5 },
        { descripcion: "3", momio: 29 },
        { descripcion: "4", momio: 67 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 9 },
      { descripcion: "2-0", momio: 10 },
      { descripcion: "3-0", momio: 17 },
      { descripcion: "4-0", momio: 34 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 151 },
      { descripcion: "7-0", momio: 451 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 401 },

      { descripcion: "3-2", momio: 23 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 81 },
      { descripcion: "6-2", momio: 201 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 151 },
      { descripcion: "6-3", momio: 451 },

      { descripcion: "5-4", momio: 501 },

      { descripcion: "0-0", momio: 12 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 13 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 151 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 101 },
      { descripcion: "0-5", momio: 401 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 67 },
      { descripcion: "1-5", momio: 201 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 251 },

      { descripcion: "3-4", momio: 101 },
      { descripcion: "3-5", momio: 401 }
    ]
  },
"tunezpaisesbajos": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 11 },
      { descripcion: "2.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 1.05 },
      { descripcion: "2.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.61 },
      { descripcion: "3.5", momio: 2.62 },
      { descripcion: "4.5", momio: 4.5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 19 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.2 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.18 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.02 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.02 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.32 },
      { descripcion: "3.5", momio: 2 },
      { descripcion: "4.5", momio: 3.4 },
      { descripcion: "5.5", momio: 6 },
      { descripcion: "6.5", momio: 11 },
      { descripcion: "7.5", momio: 21 },
      { descripcion: "8.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 19 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 1.8 },
      { descripcion: "4.5", momio: 1.33 },
      { descripcion: "5.5", momio: 1.12 },
      { descripcion: "6.5", momio: 1.05 },
      { descripcion: "7.5", momio: 1.015 },
      { descripcion: "8.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 26},
      { descripcion: "empate", momio: 9.5},
      { descripcion: "visita", momio: 1.09}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 22.5 },
        { descripcion: "2", momio: 84 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.32 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 4.43 },
        { descripcion: "4", momio: 6.12 },
        { descripcion: "5", momio: 9.87 },
        { descripcion: "6", momio: 17 },
        { descripcion: "7", momio: 32 },
        { descripcion: "8", momio: 66 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 41 },
      { descripcion: "2-0", momio: 126 },

      { descripcion: "2-1", momio: 51 },
      { descripcion: "3-1", momio: 251 },

      { descripcion: "3-2", momio: 201 },

      { descripcion: "0-0", momio: 19 },
      { descripcion: "1-1", momio: 19 },
      { descripcion: "2-2", momio: 41 },
      { descripcion: "3-3", momio: 151 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 6 },
      { descripcion: "0-4", momio: 8 },
      { descripcion: "0-5", momio: 13 },
      { descripcion: "0-6", momio: 23 },
      { descripcion: "0-7", momio: 41 },
      { descripcion: "0-8", momio: 81 },
      { descripcion: "0-9", momio: 151 },
      { descripcion: "0-10", momio: 501 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 17 },
      { descripcion: "1-5", momio: 26 },
      { descripcion: "1-6", momio: 41 },
      { descripcion: "1-7", momio: 67 },
      { descripcion: "1-8", momio: 151 },
      { descripcion: "1-9", momio: 351 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 67 },
      { descripcion: "2-6", momio: 126 },
      { descripcion: "2-7", momio: 201 },
      { descripcion: "2-8", momio: 501 },

      { descripcion: "3-4", momio: 201 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"turquiaestadosunidos": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 9 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.071 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 1.97 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.5},
      { descripcion: "empate", momio: 4.1},
      { descripcion: "visita", momio: 1.9}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6.5 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 22.5 },
        { descripcion: "4", momio: 52.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.5 },
        { descripcion: "2", momio: 6.35 },
        { descripcion: "3", momio: 10.5 },
        { descripcion: "4", momio: 20.5 },
        { descripcion: "5", momio: 46.5 },
        { descripcion: "6", momio: 113 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 21 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 81 },
      { descripcion: "5-0", momio: 251 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 29 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 301 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 8 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 11 },
      { descripcion: "0-3", momio: 17 },
      { descripcion: "0-4", momio: 34 },
      { descripcion: "0-5", momio: 67 },
      { descripcion: "0-6", momio: 151 },
      { descripcion: "0-7", momio: 501 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 29 },
      { descripcion: "1-5", momio: 51 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 451 },

      { descripcion: "2-3", momio: 23 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 201 },

      { descripcion: "3-4", momio: 81 },
      { descripcion: "3-5", momio: 151 },
      { descripcion: "3-6", momio: 501 },

      { descripcion: "4-5", momio: 501 }
    ]
  },
"paraguayaustralia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.22 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 2.08 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 2.3 },
      { descripcion: "2.5", momio: 1.42 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.9},
      { descripcion: "empate", momio: 2.25},
      { descripcion: "visita", momio: 3.8}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.22 },
        { descripcion: "2", momio: 7.98 },
        { descripcion: "3", momio: 17 },
        { descripcion: "4", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.88 },
        { descripcion: "2", momio: 13 },
        { descripcion: "3", momio: 29 },
        { descripcion: "4", momio: 98.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6.5 },
      { descripcion: "2-0", momio: 11 },
      { descripcion: "3-0", momio: 26 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 151 },

      { descripcion: "2-1", momio: 12 },
      { descripcion: "3-1", momio: 29 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 101 },
      { descripcion: "5-2", momio: 351 },

      { descripcion: "4-3", momio: 251 },

      { descripcion: "0-0", momio: 4 },
      { descripcion: "1-1", momio: 5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 126 },
      { descripcion: "0-5", momio: 501 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 451 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"noruegafrancia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.12 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 2.75 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 34 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 6 },
      { descripcion: "1.5", momio: 2.2 },
      { descripcion: "2.5", momio: 1.4 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.005 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.74 },
      { descripcion: "3.5", momio: 2.62 },
      { descripcion: "4.5", momio: 4.5 },
      { descripcion: "5.5", momio: 9 },
      { descripcion: "6.5", momio: 19 },
      { descripcion: "7.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 1.96 },
      { descripcion: "3.5", momio: 1.5 },
      { descripcion: "4.5", momio: 1.2 },
      { descripcion: "5.5", momio: 1.071 },
      { descripcion: "6.5", momio: 1.02 },
      { descripcion: "7.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 4.5},
      { descripcion: "empate", momio: 4.5},
      { descripcion: "visita", momio: 1.65}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.5 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 31.5 },
        { descripcion: "4", momio: 89 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.37 },
        { descripcion: "2", momio: 5.32 },
        { descripcion: "3", momio: 8.31 },
        { descripcion: "4", momio: 16 },
        { descripcion: "5", momio: 34 },
        { descripcion: "6", momio: 72 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 15 },
      { descripcion: "2-0", momio: 29 },
      { descripcion: "3-0", momio: 51 },
      { descripcion: "4-0", momio: 126 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 81 },
      { descripcion: "5-1", momio: 301 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 81 },
      { descripcion: "5-2", momio: 301 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 8.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 9 },
      { descripcion: "0-3", momio: 13 },
      { descripcion: "0-4", momio: 26 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 101 },
      { descripcion: "0-7", momio: 251 },

      { descripcion: "1-2", momio: 8.5 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 23 },
      { descripcion: "1-5", momio: 41 },
      { descripcion: "1-6", momio: 101 },
      { descripcion: "1-7", momio: 251 },

      { descripcion: "2-3", momio: 23 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 67 },
      { descripcion: "2-6", momio: 151 },
      { descripcion: "2-7", momio: 451 },

      { descripcion: "3-4", momio: 67 },
      { descripcion: "3-5", momio: 151 },
      { descripcion: "3-6", momio: 401 },

      { descripcion: "4-5", momio: 451 }
    ]
  },
"senegalirak": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.72 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 7 },
      { descripcion: "2.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 1.1 },
      { descripcion: "2.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 2.37 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 8 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.18 },
      { descripcion: "3.5", momio: 1.57 },
      { descripcion: "4.5", momio: 1.25 },
      { descripcion: "5.5", momio: 1.083 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.22},
      { descripcion: "empate", momio: 6.5},
      { descripcion: "visita", momio: 13}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.44 },
        { descripcion: "2", momio: 10 },
        { descripcion: "3", momio: 17 },
        { descripcion: "4", momio: 7.98 },
        { descripcion: "5", momio: 15 },
        { descripcion: "6", momio: 29 },
        { descripcion: "7", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 16 },
        { descripcion: "2", momio: 34 },
        { descripcion: "3", momio: 139 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 7.5 },
      { descripcion: "4-0", momio: 11 },
      { descripcion: "5-0", momio: 21 },
      { descripcion: "6-0", momio: 41 },
      { descripcion: "7-0", momio: 67 },
      { descripcion: "8-0", momio: 151 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 19 },
      { descripcion: "5-1", momio: 29 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 251 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 126 },
      { descripcion: "7-2", momio: 251 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 201 },
      { descripcion: "6-3", momio: 451 },

      { descripcion: "0-0", momio: 15 },
      { descripcion: "1-1", momio: 13 },
      { descripcion: "2-2", momio: 29 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 29 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 201 },

      { descripcion: "1-2", momio: 34 },
      { descripcion: "1-3", momio: 101 },
      { descripcion: "1-4", momio: 451 },

      { descripcion: "2-3", momio: 81 },
      { descripcion: "2-4", momio: 351 },

      { descripcion: "3-4", momio: 401 }
    ]
  },
"uruguayespana": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 19 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.02 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.35 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.59 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 6},
      { descripcion: "empate", momio: 3.7},
      { descripcion: "visita", momio: 1.61}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 8.03 },
        { descripcion: "2", momio: 20.5 },
        { descripcion: "3", momio: 46.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.6 },
        { descripcion: "2", momio: 4.77 },
        { descripcion: "3", momio: 8.87 },
        { descripcion: "4", momio: 18.5 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 101 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 34 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 251 },

      { descripcion: "2-1", momio: 21 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 201 },

      { descripcion: "4-3", momio: 351 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 7 },
      { descripcion: "0-3", momio: 12 },
      { descripcion: "0-4", momio: 26 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 126 },
      { descripcion: "0-7", momio: 401 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 401 }
    ]
  },
"caboverdearabiasaudita": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.61 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.62},
      { descripcion: "empate", momio: 3.3},
      { descripcion: "visita", momio: 2.62}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 9.1 },
        { descripcion: "2", momio: 8.31 },
        { descripcion: "3", momio: 18.5 },
        { descripcion: "4", momio: 36.5 },
        { descripcion: "5", momio: 116 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 9.1 },
        { descripcion: "2", momio: 8.31 },
        { descripcion: "3", momio: 8.87 },
        { descripcion: "4", momio: 18.5 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 8.5 },
      { descripcion: "2-0", momio: 13 },
      { descripcion: "3-0", momio: 29 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 151 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 23 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 126 },
      { descripcion: "6-1", momio: 501 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 451 },

      { descripcion: "0-0", momio: 9 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 351 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 13 },
      { descripcion: "0-3", momio: 29 },
      { descripcion: "0-4", momio: 51 },
      { descripcion: "0-5", momio: 151 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 23 },
      { descripcion: "1-4", momio: 51 },
      { descripcion: "1-5", momio: 126 },
      { descripcion: "1-6", momio: 501 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 67 },
      { descripcion: "2-5", momio: 201 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 451 }
    ]
  },
"egiptoiran": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 8 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.083 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.61 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.2 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 2.27 },
      { descripcion: "3.5", momio: 5.5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 26 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.37 },
      { descripcion: "2.5", momio: 1.36 },
      { descripcion: "3.5", momio: 1.14 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.01 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.4},
      { descripcion: "empate", momio: 2.7},
      { descripcion: "visita", momio: 3.8}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.88 },
        { descripcion: "2", momio: 7.22 },
        { descripcion: "3", momio: 16 },
        { descripcion: "4", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.43 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 29 },
        { descripcion: "4", momio: 80.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6 },
      { descripcion: "2-0", momio: 10 },
      { descripcion: "3-0", momio: 23 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 151 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 26 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 101 },
      { descripcion: "5-2", momio: 301 },

      { descripcion: "4-3", momio: 251 },

      { descripcion: "0-0", momio: 5.5 },
      { descripcion: "1-1", momio: 5.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 17 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 101 },
      { descripcion: "0-5", momio: 451 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 401 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"nuevazelandabelgica": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.57 },
      { descripcion: "3.5", momio: 2.5 },
      { descripcion: "4.5", momio: 4.33 },
      { descripcion: "5.5", momio: 9 },
      { descripcion: "6.5", momio: 19 },
      { descripcion: "7.5", momio: 34 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 2.25 },
      { descripcion: "3.5", momio: 1.5 },
      { descripcion: "4.5", momio: 1.2 },
      { descripcion: "5.5", momio: 1.071 },
      { descripcion: "6.5", momio: 1.02 },
      { descripcion: "7.5", momio: 1.005 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.012 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.8 },
      { descripcion: "4.5", momio: 2.75 },
      { descripcion: "5.5", momio: 4.5 },
      { descripcion: "6.5", momio: 8 },
      { descripcion: "7.5", momio: 15 },
      { descripcion: "8.5", momio: 29 },
      { descripcion: "9.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 23 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 3.47 },
      { descripcion: "3.5", momio: 2 },
      { descripcion: "4.5", momio: 1.44 },
      { descripcion: "5.5", momio: 1.2 },
      { descripcion: "6.5", momio: 1.083 },
      { descripcion: "7.5", momio: 1.03 },
      { descripcion: "8.5", momio: 1.006 },
      { descripcion: "9.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 13},
      { descripcion: "empate", momio: 7},
      { descripcion: "visita", momio: 1.18}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 20.5 },
        { descripcion: "2", momio: 40.5 },
        { descripcion: "3", momio: 121 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.96 },
        { descripcion: "2", momio: 4.95 },
        { descripcion: "3", momio: 5.12 },
        { descripcion: "4", momio: 7.22 },
        { descripcion: "5", momio: 11.5 },
        { descripcion: "6", momio: 18.5 },
        { descripcion: "7", momio: 34 },
        { descripcion: "8", momio: 72 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 41 },
      { descripcion: "2-0", momio: 81 },
      { descripcion: "3-0", momio: 201 },

      { descripcion: "2-1", momio: 41 },
      { descripcion: "3-1", momio: 81 },
      { descripcion: "4-1", momio: 301 },

      { descripcion: "3-2", momio: 67 },
      { descripcion: "4-2", momio: 201 },

      { descripcion: "4-3", momio: 201 },

      { descripcion: "0-0", momio: 29 },
      { descripcion: "1-1", momio: 15 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 13 },
      { descripcion: "0-2", momio: 9 },
      { descripcion: "0-3", momio: 8.5 },
      { descripcion: "0-4", momio: 11 },
      { descripcion: "0-5", momio: 17 },
      { descripcion: "0-6", momio: 29 },
      { descripcion: "0-7", momio: 51 },
      { descripcion: "0-8", momio: 101 },
      { descripcion: "0-9", momio: 201 },

      { descripcion: "1-2", momio: 11 },
      { descripcion: "1-3", momio: 11 },
      { descripcion: "1-4", momio: 13 },
      { descripcion: "1-5", momio: 21 },
      { descripcion: "1-6", momio: 34 },
      { descripcion: "1-7", momio: 51 },
      { descripcion: "1-8", momio: 101 },
      { descripcion: "1-9", momio: 251 },

      { descripcion: "2-3", momio: 23 },
      { descripcion: "2-4", momio: 29 },
      { descripcion: "2-5", momio: 41 },
      { descripcion: "2-6", momio: 51 },
      { descripcion: "2-7", momio: 101 },
      { descripcion: "2-8", momio: 251 },

      { descripcion: "3-4", momio: 67 },
      { descripcion: "3-5", momio: 101 },
      { descripcion: "3-6", momio: 151 }
    ]
  },
"panamainglaterra": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 8 },
      { descripcion: "2.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 1.083 },
      { descripcion: "2.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.03 },
      { descripcion: "1.5", momio: 1.2 },
      { descripcion: "2.5", momio: 1.66 },
      { descripcion: "3.5", momio: 2.62 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 15 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.1 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.015 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.32 },
      { descripcion: "3.5", momio: 2 },
      { descripcion: "4.5", momio: 3.4 },
      { descripcion: "5.5", momio: 6 },
      { descripcion: "6.5", momio: 11 },
      { descripcion: "7.5", momio: 21 },
      { descripcion: "8.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 21 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 2.68 },
      { descripcion: "3.5", momio: 1.8 },
      { descripcion: "4.5", momio: 1.33 },
      { descripcion: "5.5", momio: 1.12 },
      { descripcion: "6.5", momio: 1.05 },
      { descripcion: "7.5", momio: 1.015 },
      { descripcion: "8.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 17},
      { descripcion: "empate", momio: 8.5},
      { descripcion: "visita", momio: 1.14}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 20.5 },
        { descripcion: "2", momio: 49.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.3 },
        { descripcion: "2", momio: 4.22 },
        { descripcion: "3", momio: 4.77 },
        { descripcion: "4", momio: 6.68 },
        { descripcion: "5", momio: 11 },
        { descripcion: "6", momio: 20 },
        { descripcion: "7", momio: 38 },
        { descripcion: "8", momio: 78.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 41 },
      { descripcion: "2-0", momio: 81 },
      { descripcion: "3-0", momio: 301 },

      { descripcion: "2-1", momio: 41 },
      { descripcion: "3-1", momio: 126 },

      { descripcion: "3-2", momio: 101 },
      { descripcion: "4-2", momio: 501 },

      { descripcion: "4-3", momio: 501 },

      { descripcion: "0-0", momio: 21 },
      { descripcion: "1-1", momio: 17 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 101 },


      { descripcion: "0-1", momio: 9.5 },
      { descripcion: "0-2", momio: 6.5 },
      { descripcion: "0-3", momio: 7 },
      { descripcion: "0-4", momio: 9 },
      { descripcion: "0-5", momio: 15 },
      { descripcion: "0-6", momio: 29 },
      { descripcion: "0-7", momio: 51 },
      { descripcion: "0-8", momio: 101 },
      { descripcion: "0-9", momio: 201 },

      { descripcion: "1-2", momio: 12 },
      { descripcion: "1-3", momio: 12 },
      { descripcion: "1-4", momio: 15 },
      { descripcion: "1-5", momio: 26 },
      { descripcion: "1-6", momio: 41 },
      { descripcion: "1-7", momio: 67 },
      { descripcion: "1-8", momio: 151 },
      { descripcion: "1-9", momio: 351 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 51 },
      { descripcion: "2-6", momio: 81 },
      { descripcion: "2-7", momio: 151 },
      { descripcion: "2-8", momio: 401 },

      { descripcion: "3-4", momio: 126 },
      { descripcion: "3-5", momio: 201 },
      { descripcion: "3-6", momio: 351 }
    ]
  },
"croaciaghana": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.22 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 5 },
      { descripcion: "3.5", momio: 13 },
      { descripcion: "4.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4 },
      { descripcion: "1.5", momio: 1.66 },
      { descripcion: "2.5", momio: 1.16 },
      { descripcion: "3.5", momio: 1.04 },
      { descripcion: "4.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.1 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 2.17 },
      { descripcion: "3.5", momio: 4.5 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 21 },
      { descripcion: "6.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 7 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 1.51 },
      { descripcion: "3.5", momio: 1.2 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.015 },
      { descripcion: "6.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.85},
      { descripcion: "empate", momio: 3.2},
      { descripcion: "visita", momio: 5.25}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.68 },
        { descripcion: "2", momio: 5.63 },
        { descripcion: "3", momio: 11 },
        { descripcion: "4", momio: 24 },
        { descripcion: "5", momio: 53 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.35 },
        { descripcion: "2", momio: 16 },
        { descripcion: "3", momio: 36.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 15 },
      { descripcion: "4-0", momio: 34 },
      { descripcion: "5-0", momio: 67 },
      { descripcion: "6-0", momio: 201 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 19 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 81 },
      { descripcion: "6-1", momio: 251 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 501 },

      { descripcion: "0-0", momio: 7 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 67 },

      { descripcion: "0-1", momio: 12 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 19 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 301 }
    ]
  },
"republicademocraticadelcongouzbequistan": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 4 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 1.22 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.66 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 15 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.1 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.03 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 2.49 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 19 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 1.52 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.02 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.7},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.6 },
        { descripcion: "2", momio: 5.2 },
        { descripcion: "3", momio: 9.4 },
        { descripcion: "4", momio: 20 },
        { descripcion: "5", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.03 },
        { descripcion: "2", momio: 16 },
        { descripcion: "3", momio: 36.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 13 },
      { descripcion: "4-0", momio: 29 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 151 },
      { descripcion: "7-0", momio: 501 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 17 },
      { descripcion: "4-1", momio: 34 },
      { descripcion: "5-1", momio: 67 },
      { descripcion: "6-1", momio: 151 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 126 },
      { descripcion: "6-2", momio: 401 },

      { descripcion: "4-3", momio: 151 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 12 },
      { descripcion: "0-2", momio: 26 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 201 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 251 }
    ]
  },
"colombiaportugal": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 19 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.02 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.18 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 3.75 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.5 },
      { descripcion: "1.5", momio: 1.83 },
      { descripcion: "2.5", momio: 1.25 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 2.09 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.05 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.6},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 1.95}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6.5 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 25.5 },
        { descripcion: "4", momio: 52.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.5 },
        { descripcion: "2", momio: 6.35 },
        { descripcion: "3", momio: 12 },
        { descripcion: "4", momio: 25.5 },
        { descripcion: "5", momio: 46.5 },
        { descripcion: "6", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 21 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 81 },
      { descripcion: "5-0", momio: 301 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 29 },
      { descripcion: "4-1", momio: 67 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 13 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 9 },
      { descripcion: "0-2", momio: 11 },
      { descripcion: "0-3", momio: 19 },
      { descripcion: "0-4", momio: 41 },
      { descripcion: "0-5", momio: 67 },
      { descripcion: "0-6", momio: 151 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 15 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 23 },
      { descripcion: "2-4", momio: 41 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 251 },

      { descripcion: "3-4", momio: 81 },
      { descripcion: "3-5", momio: 201 },
      { descripcion: "3-6", momio: 501 },

      { descripcion: "4-5", momio: 501 }
    ]
  },
"jordaniaargentina": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 11 },
      { descripcion: "2.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 1.05 },
      { descripcion: "2.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.72 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5.5 },
      { descripcion: "5.5", momio: 11 },
      { descripcion: "6.5", momio: 23 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 2 },
      { descripcion: "3.5", momio: 1.4 },
      { descripcion: "4.5", momio: 1.14 },
      { descripcion: "5.5", momio: 1.05 },
      { descripcion: "6.5", momio: 1.012 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.48 },
      { descripcion: "3.5", momio: 2.3 },
      { descripcion: "4.5", momio: 4 },
      { descripcion: "5.5", momio: 7 },
      { descripcion: "6.5", momio: 15 },
      { descripcion: "7.5", momio: 26 },
      { descripcion: "8.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 1.61 },
      { descripcion: "4.5", momio: 1.25 },
      { descripcion: "5.5", momio: 1.1 },
      { descripcion: "6.5", momio: 1.03 },
      { descripcion: "7.5", momio: 1.01 },
      { descripcion: "8.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 19},
      { descripcion: "empate", momio: 9},
      { descripcion: "visita", momio: 1.12}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 22.5 },
        { descripcion: "2", momio: 67 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.95 },
        { descripcion: "2", momio: 4.11 },
        { descripcion: "3", momio: 4.56 },
        { descripcion: "4", momio: 6.57 },
        { descripcion: "5", momio: 11 },
        { descripcion: "6", momio: 19.5 },
        { descripcion: "7", momio: 38 },
        { descripcion: "8", momio: 84 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 41 },
      { descripcion: "2-0", momio: 101 },
      { descripcion: "3-0", momio: 501 },

      { descripcion: "2-1", momio: 51 },
      { descripcion: "3-1", momio: 201 },

      { descripcion: "3-2", momio: 151 },

      { descripcion: "0-0", momio: 17 },
      { descripcion: "1-1", momio: 17 },
      { descripcion: "2-2", momio: 41 },
      { descripcion: "3-3", momio: 151 },

      { descripcion: "0-1", momio: 8 },
      { descripcion: "0-2", momio: 6 },
      { descripcion: "0-3", momio: 6 },
      { descripcion: "0-4", momio: 8.5 },
      { descripcion: "0-5", momio: 15 },
      { descripcion: "0-6", momio: 26 },
      { descripcion: "0-7", momio: 51 },
      { descripcion: "0-8", momio: 101 },
      { descripcion: "0-9", momio: 251 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 13 },
      { descripcion: "1-4", momio: 19 },
      { descripcion: "1-5", momio: 29 },
      { descripcion: "1-6", momio: 41 },
      { descripcion: "1-7", momio: 81 },
      { descripcion: "1-8", momio: 151 },
      { descripcion: "1-9", momio: 501 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 81 },
      { descripcion: "2-6", momio: 126 },
      { descripcion: "2-7", momio: 251 },

      { descripcion: "3-4", momio: 201 },
      { descripcion: "3-5", momio: 351 }
    ]
  },
"argeliaaustria": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 3.47 },
      { descripcion: "3.5", momio: 6.5 },
      { descripcion: "4.5", momio: 17 },
      { descripcion: "5.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 4 },
      { descripcion: "1.5", momio: 2.1 },
      { descripcion: "2.5", momio: 1.35 },
      { descripcion: "3.5", momio: 1.11 },
      { descripcion: "4.5", momio: 1.025 },
      { descripcion: "5.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.5},
      { descripcion: "empate", momio: 2.05},
      { descripcion: "visita", momio: 3.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 5 },
        { descripcion: "2", momio: 11 },
        { descripcion: "3", momio: 27 },
        { descripcion: "4", momio: 66 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5 },
        { descripcion: "2", momio: 11 },
        { descripcion: "3", momio: 27 },
        { descripcion: "4", momio: 66 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 15 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 81 },
      { descripcion: "5-0", momio: 351 },

      { descripcion: "2-1", momio: 15 },
      { descripcion: "3-1", momio: 41 },
      { descripcion: "4-1", momio: 81 },
      { descripcion: "5-1", momio: 351 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 451 },

      { descripcion: "0-0", momio: 4 },
      { descripcion: "1-1", momio: 4.5 },
      { descripcion: "2-2", momio: 19 },
      { descripcion: "3-3", momio: 81 },

      { descripcion: "0-1", momio: 7.5 },
      { descripcion: "0-2", momio: 15 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 351 },

      { descripcion: "1-2", momio: 15 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 81 },
      { descripcion: "1-5", momio: 351 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 151 },

      { descripcion: "3-4", momio: 451 }
    ]
  },
"sudafricacanada": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 4 },
      { descripcion: "3.5", momio: 10 },
      { descripcion: "4.5", momio: 23 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 1.22 },
      { descripcion: "3.5", momio: 1.062 },
      { descripcion: "4.5", momio: 1.012 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.071 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.61 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 5.5},
      { descripcion: "empate", momio: 3.7},
      { descripcion: "visita", momio: 1.66}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 7.72 },
        { descripcion: "2", momio: 18.5 },
        { descripcion: "3", momio: 46.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 3.6 },
        { descripcion: "2", momio: 5.2 },
        { descripcion: "3", momio: 9.4 },
        { descripcion: "4", momio: 20 },
        { descripcion: "5", momio: 38 },
        { descripcion: "6", momio: 101 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 13 },
      { descripcion: "2-0", momio: 29 },
      { descripcion: "3-0", momio: 67 },
      { descripcion: "4-0", momio: 201 },

      { descripcion: "2-1", momio: 19 },
      { descripcion: "3-1", momio: 51 },
      { descripcion: "4-1", momio: 151 },

      { descripcion: "3-2", momio: 51 },
      { descripcion: "4-2", momio: 151 },

      { descripcion: "4-3", momio: 301 },

      { descripcion: "0-0", momio: 8.5 },
      { descripcion: "1-1", momio: 7 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 6 },
      { descripcion: "0-2", momio: 7.5 },
      { descripcion: "0-3", momio: 13 },
      { descripcion: "0-4", momio: 29 },
      { descripcion: "0-5", momio: 51 },
      { descripcion: "0-6", momio: 126 },
      { descripcion: "0-7", momio: 451 },

      { descripcion: "1-2", momio: 9 },
      { descripcion: "1-3", momio: 17 },
      { descripcion: "1-4", momio: 34 },
      { descripcion: "1-5", momio: 67 },
      { descripcion: "1-6", momio: 151 },
      { descripcion: "1-7", momio: 501 },

      { descripcion: "2-3", momio: 34 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 126 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 151 },
      { descripcion: "3-5", momio: 401 }
    ]
  },
"brasiljapon": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.16 },
      { descripcion: "1.5", momio: 1.8 },
      { descripcion: "2.5", momio: 3.5 },
      { descripcion: "3.5", momio: 8 },
      { descripcion: "4.5", momio: 21 },
      { descripcion: "5.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 5 },
      { descripcion: "1.5", momio: 1.9 },
      { descripcion: "2.5", momio: 1.28 },
      { descripcion: "3.5", momio: 1.083 },
      { descripcion: "4.5", momio: 1.015 },
      { descripcion: "5.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.57 },
      { descripcion: "1.5", momio: 4 },
      { descripcion: "2.5", momio: 13 },
      { descripcion: "3.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.25 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.04 },
      { descripcion: "3.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.95 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 10 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.75 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.66},
      { descripcion: "empate", momio: 3.8},
      { descripcion: "visita", momio: 5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.94 },
        { descripcion: "2", momio: 5.22 },
        { descripcion: "3", momio: 8.98 },
        { descripcion: "4", momio: 17 },
        { descripcion: "5", momio: 36.5 },
        { descripcion: "6", momio: 96 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 7.97 },
        { descripcion: "2", momio: 17 },
        { descripcion: "3", momio: 34 },
        { descripcion: "4", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7 },
      { descripcion: "2-0", momio: 8 },
      { descripcion: "3-0", momio: 13 },
      { descripcion: "4-0", momio: 26 },
      { descripcion: "5-0", momio: 51 },
      { descripcion: "6-0", momio: 126 },
      { descripcion: "7-0", momio: 401 },

      { descripcion: "2-1", momio: 9 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 29 },
      { descripcion: "5-1", momio: 51 },
      { descripcion: "6-1", momio: 126 },
      { descripcion: "7-1", momio: 401 },

      { descripcion: "3-2", momio: 29 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },


      { descripcion: "4-3", momio: 101 },
      { descripcion: "5-3", momio: 251 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 7.5 },
      { descripcion: "2-2", momio: 17 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 351 },

      { descripcion: "0-1", momio: 15 },
      { descripcion: "0-2", momio: 29 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 151 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 101 },
      { descripcion: "1-5", momio: 501 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 126 },
      { descripcion: "2-5", momio: 501 },

      { descripcion: "3-4", momio: 201 }
    ]
  },
"alemaniaparaguay": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.44 },
      { descripcion: "2.5", momio: 2.37 },
      { descripcion: "3.5", momio: 4.5 },
      { descripcion: "4.5", momio: 10 },
      { descripcion: "5.5", momio: 23 },
      { descripcion: "6.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 2.62 },
      { descripcion: "2.5", momio: 1.53 },
      { descripcion: "3.5", momio: 1.18 },
      { descripcion: "4.5", momio: 1.062 },
      { descripcion: "5.5", momio: 1.012 },
      { descripcion: "6.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 6 },
      { descripcion: "2.5", momio: 21 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.83 },
      { descripcion: "1.5", momio: 1.12 },
      { descripcion: "2.5", momio: 1.015 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.04 },
      { descripcion: "1.5", momio: 1.22 },
      { descripcion: "2.5", momio: 1.56 },
      { descripcion: "3.5", momio: 2.75 },
      { descripcion: "4.5", momio: 5 },
      { descripcion: "5.5", momio: 10 },
      { descripcion: "6.5", momio: 21 },
      { descripcion: "7.5", momio: 41 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 13 },
      { descripcion: "1.5", momio: 4.33 },
      { descripcion: "2.5", momio: 2.06 },
      { descripcion: "3.5", momio: 1.44 },
      { descripcion: "4.5", momio: 1.16 },
      { descripcion: "5.5", momio: 1.062 },
      { descripcion: "6.5", momio: 1.015 },
      { descripcion: "7.5", momio: 1.004 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.33},
      { descripcion: "empate", momio: 5.25},
      { descripcion: "visita", momio: 9.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.19 },
        { descripcion: "2", momio: 4.21 },
        { descripcion: "3", momio: 6.05 },
        { descripcion: "4", momio: 11 },
        { descripcion: "5", momio: 20 },
        { descripcion: "6", momio: 38 },
        { descripcion: "7", momio: 82.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 13 },
        { descripcion: "2", momio: 31.5 },
        { descripcion: "3", momio: 89 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 6.5 },
      { descripcion: "3-0", momio: 8.5 },
      { descripcion: "4-0", momio: 15 },
      { descripcion: "5-0", momio: 29 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 101 },
      { descripcion: "8-0", momio: 301 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 12 },
      { descripcion: "4-1", momio: 21 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 67 },
      { descripcion: "7-1", momio: 151 },
      { descripcion: "8-1", momio: 451 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 67 },
      { descripcion: "6-2", momio: 151 },
      { descripcion: "7-2", momio: 401 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 201 },
      { descripcion: "6-3", momio: 501 },

      { descripcion: "0-0", momio: 13 },
      { descripcion: "1-1", momio: 10 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 81 },
      { descripcion: "4-4", momio: 501 },

      { descripcion: "0-1", momio: 23 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 126 },

      { descripcion: "1-2", momio: 29 },
      { descripcion: "1-3", momio: 81 },
      { descripcion: "1-4", momio: 301 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 251 },

      { descripcion: "3-4", momio: 351 }
    ]
  },
"paisesbajosmarruecos": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 5.5 },
      { descripcion: "3.5", momio: 15 },
      { descripcion: "4.5", momio: 41 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 1.14 },
      { descripcion: "3.5", momio: 1.03 },
      { descripcion: "4.5", momio: 1.004 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3.25 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 2.53 },
      { descripcion: "3.5", momio: 3.75 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.78 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.25},
      { descripcion: "empate", momio: 3},
      { descripcion: "visita", momio: 3.6}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.29 },
        { descripcion: "2", momio: 7.22 },
        { descripcion: "3", momio: 14 },
        { descripcion: "4", momio: 29 },
        { descripcion: "5", momio: 75.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.96 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 25.5 },
        { descripcion: "4", momio: 61 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 11 },
      { descripcion: "3-0", momio: 21 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 101 },
      { descripcion: "6-0", momio: 351 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 21 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 101 },
      { descripcion: "6-1", momio: 301 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 351 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 6 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 301 },

      { descripcion: "0-1", momio: 11 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 301 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 67 },
      { descripcion: "1-5", momio: 251 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 101 },
      { descripcion: "2-5", momio: 301 },

      { descripcion: "3-4", momio: 151 }
    ]
  },
"costademarfilnoruega": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.4 },
      { descripcion: "1.5", momio: 3 },
      { descripcion: "2.5", momio: 8 },
      { descripcion: "3.5", momio: 23 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 2.75 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 1.083 },
      { descripcion: "3.5", momio: 1.012 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.2 },
      { descripcion: "1.5", momio: 2 },
      { descripcion: "2.5", momio: 4.33 },
      { descripcion: "3.5", momio: 11 },
      { descripcion: "4.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 4.33 },
      { descripcion: "1.5", momio: 1.72 },
      { descripcion: "2.5", momio: 1.2 },
      { descripcion: "3.5", momio: 1.05 },
      { descripcion: "4.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.28 },
      { descripcion: "2.5", momio: 2.47 },
      { descripcion: "3.5", momio: 3.2 },
      { descripcion: "4.5", momio: 6 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 },
      { descripcion: "7.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.75 },
      { descripcion: "2.5", momio: 1.88 },
      { descripcion: "3.5", momio: 1.36 },
      { descripcion: "4.5", momio: 1.12 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 },
      { descripcion: "7.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 3.4},
      { descripcion: "empate", momio: 3.4},
      { descripcion: "visita", momio: 2.15}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 6.24 },
        { descripcion: "2", momio: 11.5 },
        { descripcion: "3", momio: 22.5 },
        { descripcion: "4", momio: 52.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 4.49 },
        { descripcion: "2", momio: 6.97 },
        { descripcion: "3", momio: 14 },
        { descripcion: "4", momio: 27 },
        { descripcion: "5", momio: 57.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 12 },
      { descripcion: "2-0", momio: 19 },
      { descripcion: "3-0", momio: 41 },
      { descripcion: "4-0", momio: 81 },
      { descripcion: "5-0", momio: 251 },

      { descripcion: "2-1", momio: 13 },
      { descripcion: "3-1", momio: 29 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 67 },
      { descripcion: "5-2", momio: 201 },

      { descripcion: "4-3", momio: 126 },
      { descripcion: "5-3", momio: 401 },

      { descripcion: "0-0", momio: 11 },
      { descripcion: "1-1", momio: 6.5 },
      { descripcion: "2-2", momio: 13 },
      { descripcion: "3-3", momio: 41 },
      { descripcion: "4-4", momio: 201 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 11 },
      { descripcion: "0-3", momio: 21 },
      { descripcion: "0-4", momio: 41 },
      { descripcion: "0-5", momio: 81 },
      { descripcion: "0-6", momio: 251 },

      { descripcion: "1-2", momio: 9.5 },
      { descripcion: "1-3", momio: 19 },
      { descripcion: "1-4", momio: 41 },
      { descripcion: "1-5", momio: 81 },
      { descripcion: "1-6", momio: 201 },

      { descripcion: "2-3", momio: 29 },
      { descripcion: "2-4", momio: 51 },
      { descripcion: "2-5", momio: 101 },
      { descripcion: "2-6", momio: 351 },

      { descripcion: "3-4", momio: 101 },
      { descripcion: "3-5", momio: 251 }
    ]
  },
"franciasuecia": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.05 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.9 },
      { descripcion: "3.5", momio: 3.5 },
      { descripcion: "4.5", momio: 7 },
      { descripcion: "5.5", momio: 15 },
      { descripcion: "6.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 11 },
      { descripcion: "1.5", momio: 3.4 },
      { descripcion: "2.5", momio: 1.8 },
      { descripcion: "3.5", momio: 1.28 },
      { descripcion: "4.5", momio: 1.1 },
      { descripcion: "5.5", momio: 1.03 },
      { descripcion: "6.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.8 },
      { descripcion: "1.5", momio: 5 },
      { descripcion: "2.5", momio: 19 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.9 },
      { descripcion: "1.5", momio: 1.16 },
      { descripcion: "2.5", momio: 1.02 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.025 },
      { descripcion: "1.5", momio: 1.14 },
      { descripcion: "2.5", momio: 1.65 },
      { descripcion: "3.5", momio: 2.2 },
      { descripcion: "4.5", momio: 3.75 },
      { descripcion: "5.5", momio: 7 },
      { descripcion: "6.5", momio: 13 },
      { descripcion: "7.5", momio: 26 },
      { descripcion: "8.5", momio: 51 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 17 },
      { descripcion: "1.5", momio: 5.5 },
      { descripcion: "2.5", momio: 2.5 },
      { descripcion: "3.5", momio: 1.66 },
      { descripcion: "4.5", momio: 1.28 },
      { descripcion: "5.5", momio: 1.1 },
      { descripcion: "6.5", momio: 1.04 },
      { descripcion: "7.5", momio: 1.01 },
      { descripcion: "8.5", momio: 1.002 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.27},
      { descripcion: "empate", momio: 6},
      { descripcion: "visita", momio: 11}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.75 },
        { descripcion: "2", momio: 4.46 },
        { descripcion: "3", momio: 5.67 },
        { descripcion: "4", momio: 8.98 },
        { descripcion: "5", momio: 16 },
        { descripcion: "6", momio: 29 },
        { descripcion: "7", momio: 61 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 14.5 },
        { descripcion: "2", momio: 29 },
        { descripcion: "3", momio: 94.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 9.5 },
      { descripcion: "2-0", momio: 7.5 },
      { descripcion: "3-0", momio: 8.5 },
      { descripcion: "4-0", momio: 13 },
      { descripcion: "5-0", momio: 23 },
      { descripcion: "6-0", momio: 41 },
      { descripcion: "7-0", momio: 81 },
      { descripcion: "8-0", momio: 151 },
      { descripcion: "9-0", momio: 501 },

      { descripcion: "2-1", momio: 9.5 },
      { descripcion: "3-1", momio: 11 },
      { descripcion: "4-1", momio: 17 },
      { descripcion: "5-1", momio: 29 },
      { descripcion: "6-1", momio: 51 },
      { descripcion: "7-1", momio: 101 },
      { descripcion: "8-1", momio: 251 },

      { descripcion: "3-2", momio: 26 },
      { descripcion: "4-2", momio: 41 },
      { descripcion: "5-2", momio: 51 },
      { descripcion: "6-2", momio: 101 },
      { descripcion: "7-2", momio: 201 },
      { descripcion: "8-2", momio: 501 },

      { descripcion: "4-3", momio: 81 },
      { descripcion: "5-3", momio: 51 },
      { descripcion: "6-3", momio: 301 },

      { descripcion: "0-0", momio: 19 },
      { descripcion: "1-1", momio: 12 },
      { descripcion: "2-2", momio: 21 },
      { descripcion: "3-3", momio: 67 },
      { descripcion: "4-4", momio: 301 },

      { descripcion: "0-1", momio: 29 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 151 },

      { descripcion: "1-2", momio: 29 },
      { descripcion: "1-3", momio: 67 },
      { descripcion: "1-4", momio: 251 },

      { descripcion: "2-3", momio: 67 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 251 }
    ]
  },
"mexicoecuador": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.36 },
      { descripcion: "1.5", momio: 2.75 },
      { descripcion: "2.5", momio: 7 },
      { descripcion: "3.5", momio: 21 },
      { descripcion: "4.5", momio: 51 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3 },
      { descripcion: "1.5", momio: 1.4 },
      { descripcion: "2.5", momio: 1.1 },
      { descripcion: "3.5", momio: 1.015 },
      { descripcion: "4.5", momio: 1.002 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.72 },
      { descripcion: "1.5", momio: 4.5 },
      { descripcion: "2.5", momio: 17 },
      { descripcion: "3.5", momio: 51 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2 },
      { descripcion: "1.5", momio: 1.18 },
      { descripcion: "2.5", momio: 1.025 },
      { descripcion: "3.5", momio: 1.002 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.14 },
      { descripcion: "1.5", momio: 1.61 },
      { descripcion: "2.5", momio: 2.38 },
      { descripcion: "3.5", momio: 6 },
      { descripcion: "4.5", momio: 15 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 5.5 },
      { descripcion: "1.5", momio: 2.3 },
      { descripcion: "2.5", momio: 1.31 },
      { descripcion: "3.5", momio: 1.12 },
      { descripcion: "4.5", momio: 1.03 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.15},
      { descripcion: "empate", momio: 2.9},
      { descripcion: "visita", momio: 4}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.67 },
        { descripcion: "2", momio: 6.69 },
        { descripcion: "3", momio: 15 },
        { descripcion: "4", momio: 38 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.67 },
        { descripcion: "2", momio: 13 },
        { descripcion: "3", momio: 36.5 },
        { descripcion: "4", momio: 116 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 5.5 },
      { descripcion: "2-0", momio: 9 },
      { descripcion: "3-0", momio: 21 },
      { descripcion: "4-0", momio: 51 },
      { descripcion: "5-0", momio: 126 },
      { descripcion: "6-0", momio: 501 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 26 },
      { descripcion: "4-1", momio: 51 },
      { descripcion: "5-1", momio: 151 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 101 },
      { descripcion: "5-2", momio: 301 },

      { descripcion: "4-3", momio: 301 },

      { descripcion: "0-0", momio: 5.5 },
      { descripcion: "1-1", momio: 6 },
      { descripcion: "2-2", momio: 23 },
      { descripcion: "3-3", momio: 101 },

      { descripcion: "0-1", momio: 8.5 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 51 },
      { descripcion: "0-4", momio: 151 },

      { descripcion: "1-2", momio: 17 },
      { descripcion: "1-3", momio: 41 },
      { descripcion: "1-4", momio: 126 },
      { descripcion: "1-5", momio: 501 },

      { descripcion: "2-3", momio: 51 },
      { descripcion: "2-4", momio: 201 },

      { descripcion: "3-4", momio: 401 }
    ]
  },
"inglaterrarepublicademocraticadelcongo": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.1 },
      { descripcion: "1.5", momio: 1.53 },
      { descripcion: "2.5", momio: 2.62 },
      { descripcion: "3.5", momio: 5.5 },
      { descripcion: "4.5", momio: 13 },
      { descripcion: "5.5", momio: 29 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 7 },
      { descripcion: "1.5", momio: 2.37 },
      { descripcion: "2.5", momio: 1.44 },
      { descripcion: "3.5", momio: 1.14 },
      { descripcion: "4.5", momio: 1.04 },
      { descripcion: "5.5", momio: 1.006 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 2.5 },
      { descripcion: "1.5", momio: 11 },
      { descripcion: "2.5", momio: 41 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 1.5 },
      { descripcion: "1.5", momio: 1.05 },
      { descripcion: "2.5", momio: 1.004 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.062 },
      { descripcion: "1.5", momio: 1.3 },
      { descripcion: "2.5", momio: 1.95 },
      { descripcion: "3.5", momio: 3.4 },
      { descripcion: "4.5", momio: 6.5 },
      { descripcion: "5.5", momio: 13 },
      { descripcion: "6.5", momio: 26 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 9.5 },
      { descripcion: "1.5", momio: 3.5 },
      { descripcion: "2.5", momio: 1.78 },
      { descripcion: "3.5", momio: 1.33 },
      { descripcion: "4.5", momio: 1.11 },
      { descripcion: "5.5", momio: 1.04 },
      { descripcion: "6.5", momio: 1.01 }
    ],

    resultado: [
      { descripcion: "casa", momio: 1.27},
      { descripcion: "empate", momio: 5.5},
      { descripcion: "visita", momio: 13}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 3.88 },
        { descripcion: "2", momio: 4.02 },
        { descripcion: "3", momio: 5.37 },
        { descripcion: "4", momio: 9.87 },
        { descripcion: "5", momio: 19.5 },
        { descripcion: "6", momio: 40.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 14.5 },
        { descripcion: "2", momio: 36.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 6 },
      { descripcion: "2-0", momio: 5.5 },
      { descripcion: "3-0", momio: 7 },
      { descripcion: "4-0", momio: 13 },
      { descripcion: "5-0", momio: 26 },
      { descripcion: "6-0", momio: 51 },
      { descripcion: "7-0", momio: 101 },
      { descripcion: "8-0", momio: 301 },

      { descripcion: "2-1", momio: 11 },
      { descripcion: "3-1", momio: 15 },
      { descripcion: "4-1", momio: 23 },
      { descripcion: "5-1", momio: 41 },
      { descripcion: "6-1", momio: 81 },
      { descripcion: "7-1", momio: 201 },

      { descripcion: "3-2", momio: 41 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 101 },
      { descripcion: "6-2", momio: 251 },

      { descripcion: "4-3", momio: 251 },
      { descripcion: "5-3", momio: 501 },

      { descripcion: "0-0", momio: 10 },
      { descripcion: "1-1", momio: 11 },
      { descripcion: "2-2", momio: 34 },
      { descripcion: "3-3", momio: 151 },

      { descripcion: "0-1", momio: 23 },
      { descripcion: "0-2", momio: 51 },
      { descripcion: "0-3", momio: 201 },

      { descripcion: "1-2", momio: 41 },
      { descripcion: "1-3", momio: 126 },

      { descripcion: "2-3", momio: 101 }
    ]
  },
"belgicasenegal": {

    golesMasCasa: [
      { descripcion: "0.5", momio: 1.25 },
      { descripcion: "1.5", momio: 2.25 },
      { descripcion: "2.5", momio: 5.5 },
      { descripcion: "3.5", momio: 15 },
      { descripcion: "4.5", momio: 34 }
    ],

    golesMenosCasa: [
      { descripcion: "0.5", momio: 3.75 },
      { descripcion: "1.5", momio: 1.57 },
      { descripcion: "2.5", momio: 1.14 },
      { descripcion: "3.5", momio: 1.03 },
      { descripcion: "4.5", momio: 1.005 }
    ],

    golesMasVisita: [
      { descripcion: "0.5", momio: 1.44 },
      { descripcion: "1.5", momio: 3.25 },
      { descripcion: "2.5", momio: 10 },
      { descripcion: "3.5", momio: 26 }
    ],

    golesMenosVisita: [
      { descripcion: "0.5", momio: 2.62 },
      { descripcion: "1.5", momio: 1.33 },
      { descripcion: "2.5", momio: 1.062 },
      { descripcion: "3.5", momio: 1.01 }
    ],

    golesMasTotales: [
      { descripcion: "0.5", momio: 1.083 },
      { descripcion: "1.5", momio: 1.36 },
      { descripcion: "2.5", momio: 2.34 },
      { descripcion: "3.5", momio: 4 },
      { descripcion: "4.5", momio: 8 },
      { descripcion: "5.5", momio: 17 },
      { descripcion: "6.5", momio: 34 }
    ],

    golesMenosTotales: [
      { descripcion: "0.5", momio: 8 },
      { descripcion: "1.5", momio: 3.2 },
      { descripcion: "2.5", momio: 1.67 },
      { descripcion: "3.5", momio: 1.25 },
      { descripcion: "4.5", momio: 1.083 },
      { descripcion: "5.5", momio: 1.025 },
      { descripcion: "6.5", momio: 1.005 }
    ],

    resultado: [
      { descripcion: "casa", momio: 2.2},
      { descripcion: "empate", momio: 3.2},
      { descripcion: "visita", momio: 3.5}
    ],

    diferenciaCasa:[
        { descripcion: "1", momio: 4.29 },
        { descripcion: "2", momio: 7.22 },
        { descripcion: "3", momio: 14 },
        { descripcion: "4", momio: 29 },
        { descripcion: "5", momio: 75.5 }
      ],

    diferenciaVisita: [
        { descripcion: "1", momio: 5.65 },
        { descripcion: "2", momio: 12 },
        { descripcion: "3", momio: 25.5 }
      ],

    marcadorExacto: [
      { descripcion: "1-0", momio: 7.5 },
      { descripcion: "2-0", momio: 11 },
      { descripcion: "3-0", momio: 21 },
      { descripcion: "4-0", momio: 41 },
      { descripcion: "5-0", momio: 101 },
      { descripcion: "6-0", momio: 351 },

      { descripcion: "2-1", momio: 10 },
      { descripcion: "3-1", momio: 21 },
      { descripcion: "4-1", momio: 41 },
      { descripcion: "5-1", momio: 101 },
      { descripcion: "6-1", momio: 301 },

      { descripcion: "3-2", momio: 34 },
      { descripcion: "4-2", momio: 51 },
      { descripcion: "5-2", momio: 151 },
      { descripcion: "6-2", momio: 501 },

      { descripcion: "4-3", momio: 126 },

      { descripcion: "0-0", momio: 8 },
      { descripcion: "1-1", momio: 6 },
      { descripcion: "2-2", momio: 15 },
      { descripcion: "3-3", momio: 51 },
      { descripcion: "4-4", momio: 351 },

      { descripcion: "0-1", momio: 10 },
      { descripcion: "0-2", momio: 19 },
      { descripcion: "0-3", momio: 41 },
      { descripcion: "0-4", momio: 81 },
      { descripcion: "0-5", momio: 301 },

      { descripcion: "1-2", momio: 13 },
      { descripcion: "1-3", momio: 34 },
      { descripcion: "1-4", momio: 67 },

      { descripcion: "2-3", momio: 41 },
      { descripcion: "2-4", momio: 81 },
      { descripcion: "2-5", momio: 301 },

      { descripcion: "3-4", momio: 151 }
    ]
  }
};

const HORAS_LIMITE = {
  "mexicosudafrica": new Date("2026-06-11T18:50:00Z"),
  "coreadelsurrepublicacheca": new Date("2026-06-12T01:50:00Z"),
  "canadabosniayherzegovina": new Date("2026-06-12T18:50:00Z"),
  "estadosunidosparaguay": new Date("2026-06-13T00:50:00Z"),
  "catarsuiza": new Date("2026-06-13T18:50:00Z"),
  "brasilmarruecos": new Date("2026-06-13T21:50:00Z"),
  "haitiescocia": new Date("2026-06-14T00:50:00Z"),
  "australiaturquia": new Date("2026-06-14T03:50:00Z"),
  "alemaniacurazao": new Date("2026-06-14T16:50:00Z"),
  "paisesbajosjapon": new Date("2026-06-14T19:50:00Z"),
  "costademarfilecuador": new Date("2026-06-14T22:50:00Z"),
  "sueciatunez": new Date("2026-06-15T01:50:00Z"),
  "espanacaboverde": new Date("2026-06-15T15:50:00Z"),
  "belgicaegipto": new Date("2026-06-15T18:50:00Z"),
  "arabiasauditauruguay": new Date("2026-06-15T21:50:00Z"),
  "irannuevazelanda": new Date("2026-06-16T00:50:00Z"),
  "franciasenegal": new Date("2026-06-16T18:50:00Z"),
  "iraknoruega": new Date("2026-06-16T21:50:00Z"),
  "argentinaargelia": new Date("2026-06-17T00:50:00Z"),
  "austriajordania": new Date("2026-06-17T03:50:00Z"),
  "portugalrepublicademocraticadelcongo": new Date("2026-06-17T16:50:00Z"),
  "inglaterracroacia": new Date("2026-06-17T19:50:00Z"),
  "ghanapanama": new Date("2026-06-17T22:50:00Z"),
  "uzbequistancolombia": new Date("2026-06-18T01:50:00Z"),
  "republicachecasudafrica": new Date("2026-06-18T15:50:00Z"),
  "suizabosniayherzegovina": new Date("2026-06-18T18:50:00Z"),
  "canadacatar": new Date("2026-06-18T21:50:00Z"),
  "mexicocoreadelsur": new Date("2026-06-19T00:50:00Z"),
  "estadosunidosaustralia": new Date("2026-06-19T18:50:00Z"),
  "escociamarruecos": new Date("2026-06-19T21:50:00Z"),
  "brasilhaiti": new Date("2026-06-20T00:20:00Z"),
  "turquiaparaguay": new Date("2026-06-20T02:50:00Z"),
  "paisesbajossuecia": new Date("2026-06-20T16:50:00Z"),
  "alemaniacostademarfil": new Date("2026-06-20T19:50:00Z"),
  "ecuadorcurazao": new Date("2026-06-20T23:50:00Z"),
  "tunezjapon": new Date("2026-06-21T03:50:00Z"),
  "espanaarabiasaudita": new Date("2026-06-21T15:50:00Z"),
  "belgicairan": new Date("2026-06-21T18:50:00Z"),
  "uruguaycaboverde": new Date("2026-06-21T21:50:00Z"),
  "nuevazelandaegipto": new Date("2026-06-22T00:50:00Z"),
  "argentinaaustria": new Date("2026-06-22T16:50:00Z"),
  "franciairak": new Date("2026-06-22T20:50:00Z"),
  "noruegasenegal": new Date("2026-06-22T23:50:00Z"),
  "jordaniaargelia": new Date("2026-06-23T02:50:00Z"),
  "portugaluzbequistan": new Date("2026-06-23T16:50:00Z"),
  "inglaterraghana": new Date("2026-06-23T19:50:00Z"),
  "panamacroacia": new Date("2026-06-23T22:50:00Z"),
  "colombiarepublicademocraticadelcongo": new Date("2026-06-24T01:50:00Z"),
  "suizacanada": new Date("2026-06-24T18:50:00Z"),
  "bosniayherzegovinacatar": new Date("2026-06-24T18:50:00Z"),
  "escociabrasil": new Date("2026-06-24T21:50:00Z"),
  "marruecoshaiti": new Date("2026-06-24T21:50:00Z"),
  "republicachecamexico": new Date("2026-06-25T00:50:00Z"),
  "sudafricacoreadelsur": new Date("2026-06-25T00:50:00Z"),
  "curazaocostademarfil": new Date("2026-06-25T19:50:00Z"),
  "ecuadoralemania": new Date("2026-06-25T19:50:00Z"),
  "japonsuecia": new Date("2026-06-25T22:50:00Z"),
  "tunezpaisesbajos": new Date("2026-06-25T22:50:00Z"),
  "turquiaestadosunidos": new Date("2026-06-26T01:50:00Z"),
  "paraguayaustralia": new Date("2026-06-26T01:50:00Z"),
  "noruegafrancia": new Date("2026-06-26T18:50:00Z"),
  "senegalirak": new Date("2026-06-26T18:50:00Z"),
  "uruguayespana": new Date("2026-06-26T23:50:00Z"),
  "caboverdearabiasaudita": new Date("2026-06-26T23:50:00Z"),
  "egiptoiran": new Date("2026-06-27T02:50:00Z"),
  "nuevazelandabelgica": new Date("2026-06-27T02:50:00Z"),
  "panamainglaterra": new Date("2026-06-27T20:50:00Z"),
  "croaciaghana": new Date("2026-06-27T20:50:00Z"),
  "republicademocraticadelcongouzbequistan": new Date("2026-06-27T23:20:00Z"),
  "colombiaportugal": new Date("2026-06-27T23:20:00Z"),
  "jordaniaargentina": new Date("2026-06-28T01:50:00Z"),
  "argeliaaustria": new Date("2026-06-28T01:50:00Z"),
  "sudafricacanada": new Date("2026-06-28T18:50:00Z"),
  "brasiljapon": new Date("2026-06-29T16:50:00Z"),
  "alemaniaparaguay": new Date("2026-06-29T20:20:00Z"),
  "paisesbajosmarruecos": new Date("2026-06-30T01:50:00Z"),
  "costademarfilnoruega": new Date("2026-06-30T16:50:00Z"),
  "franciasuecia": new Date("2026-06-30T20:50:00Z"),
  "mexicoecuador": new Date("2026-07-01T00:50:00Z"),
  "inglaterrarepublicademocraticadelcongo": new Date("2026-07-01T15:50:00Z"),
  "belgicasenegal": new Date("2026-07-01T19:50:00Z")
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

	const ahora = new Date();
        const limite = HORAS_LIMITE[m.idPartido];

        if (m.uid !== "ADMINISTRADOR" && limite && ahora > limite) {
    console.log("⛔ Usuario bloqueado:", m.uid);
    client.release();
    return res.status(403).json({ error: "Apuestas cerradas" });
}

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

     const { rows: usuarios } = await client.query(
        "SELECT uid FROM usuarios"
    );



    const predicciones = marcadores.filter(
        m => m.uid !== "ADMINISTRADOR"
    );

    const ganadorReal = definirGanador(
        resultado.golescasa,
        resultado.golesvisita
    );

    const momio = MOMIOS[idPartido] || {};

    for (const u of usuarios) {

	if (u.uid === "ADMINISTRADOR") continue;

        const p = marcadores.find(m => m.uid === u.uid);

        if (!p) {
            await client.query(`
                INSERT INTO puntosPartido (uid, idPartido, puntos)
                VALUES ($1, $2, $3)
                ON CONFLICT (uid, idPartido)
                DO UPDATE SET puntos = EXCLUDED.puntos
            `, [u.uid, idPartido, -100]);

            continue;
        }

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

	
	


	if ((resultado.golescasa + resultado.golesvisita) > (golesMasApostados)){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMasTotales?.find(r => r.descripcion === golesMasApostados.toString())?.momio))* 	 	    (p.apuestamas ?? 0);
	}
	else {puntos -= (p.apuestamas ?? 0)}

	if ((resultado.golescasa + resultado.golesvisita) < (golesMenosApostados)){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMenosTotales?.find(r => r.descripcion === golesMenosApostados.toString())?.momio))* 	 	    (p.apuestamenos ?? 0);
	}
	else {puntos -= (p.apuestamenos ?? 0)}


	if (resultado.golescasa > golesMasCasaApostados){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMasCasa?.find(r => r.descripcion === golesMasCasaApostados.toString())?.momio))* 	 	    (p.apuestamascasa ?? 0);
	}
	else {puntos -= (p.apuestamascasa ?? 0)}

	if (resultado.golesvisita > golesMasVisitaApostados){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMasVisita?.find(r => r.descripcion === golesMasVisitaApostados.toString())?.momio))* 	 	    (p.apuestamasvisita ?? 0);
	}
	else {puntos -= (p.apuestamasvisita ?? 0)}

	if (resultado.golescasa < golesMenosCasaApostados){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMenosCasa?.find(r => r.descripcion === golesMenosCasaApostados.toString())?.momio))* 	 	    (p.apuestamenoscasa ?? 0);
	}
	else {puntos -= (p.apuestamenoscasa ?? 0)}

	if (resultado.golesvisita < golesMenosVisitaApostados){
	    puntos += ((m => m != null ? m - 1 : 0)(momio?.golesMenosVisita?.find(r => r.descripcion === golesMenosVisitaApostados.toString())?.momio))* 	 	    (p.apuestamenosvisita ?? 0);
	}
	else {puntos -= (p.apuestamenosvisita ?? 0)}

        if (ganadorReal === ganadorUsuario && ganadorReal !== null) {
            puntos += ((m => m != null ? m - 1 : 0)(momio?.resultado?.find(r => r.descripcion === ganadorReal)?.momio))* (p.apuestaresultado ?? 0);
        }
	else {puntos -= (p.apuestaresultado ?? 0)}



	if (ganadorReal === ganadorUsuario && ganadorReal !== null && diferenciaReal === diferenciaApostada && diferenciaReal != 0) {
            if(ganadorReal === "casa"){
		puntos += ((m => m != null ? m - 1 : 0)(momio?.diferenciaCasa?.find(r => r.descripcion === diferenciaReal.toString())?.momio))* (p.apuestadiferencia ?? 		0);}
	    if(ganadorReal === "visita"){
		puntos += ((m => m != null ? m - 1 : 0)(momio?.diferenciaVisita?.find(r => r.descripcion === diferenciaReal.toString())?.momio))* 				        (p.apuestadiferencia ?? 0);}
        }
	else {puntos -= (p.apuestadiferencia ?? 0)}
	
	if (marcadorExactoUsuario === marcadorExactoReal) {
            puntos += ((m => m != null ? m - 1 : 0)(momio?.marcadorExacto?.find(r => r.descripcion === marcadorExactoReal)?.momio))* (p.apuestaexacto ?? 0);
        }
	else {puntos -= (p.apuestaexacto ?? 0)}

	
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


app.get("/marcadores", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                m.*,
                COALESCE(p.puntos, 0) AS puntos
            FROM marcadores m
            LEFT JOIN puntosPartido p
            ON m.uid = p.uid AND m.idPartido = p.idPartido
        `);

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
            uid: r.uid,
            puntos: Number(r.puntos)
        }));

        res.json(mapped);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error leyendo" });
    }
});


app.get("/usuarios/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const result = await db.query(
            "SELECT uid, nombre, puntos FROM usuarios WHERE uid = $1",
            [uid]
        );

        if (result.rows.length === 0) {
            return res.json({ uid, nombre: "", puntos: 0 });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.log("❌ Error:", err);
        res.status(500).json({ error: "Error obteniendo usuario" });
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
        const ahora = new Date();

        const respuesta = {};

        for (const idPartido in MOMIOS) {
            const limite = HORAS_LIMITE[idPartido];
            const cerrado = limite && ahora > limite;

            respuesta[idPartido] = {
                ...MOMIOS[idPartido],
                cerrado: cerrado
            };
        }

        res.json(respuesta);

    } catch (err) {
        console.log("❌ Error obteniendo momios:", err);
        res.status(500).json({ error: "Error obteniendo momios" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});