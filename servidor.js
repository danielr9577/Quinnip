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

const EQUIPOS = {
    parissaintgermain: {
        nombre: "Paris Saint Germain",
        rating: 100
    },

    fcbarcelona: {
        nombre: "FC Barcelona",
        rating: 92
    },
    asroma: {
        nombre: "AS Roma",
        rating: 87
    }
};

const PARTIDOS = {
    parissaintgermainfcbarcelona: {
        casa: "parissaintgermain",
        visita: "fcbarcelona"
    },
    parissaintgermainasroma: {
        casa: "parissaintgermain",
        visita: "asroma"
    }
};

function obtenerPartido(id) {
    const partido = PARTIDOS[id];

    if (!partido) {
        return null;
    }

    return {
        id,
        casa: EQUIPOS[partido.casa],
        visita: EQUIPOS[partido.visita]
    };
}

function calcularLambdas(ratingCasa, ratingVisita) {

    ratingCasa += 3;

    const diferencia = Math.abs(ratingCasa - ratingVisita) / 100;

    const lambdaFavorito = 1.5 + 5.6968 * Math.pow(diferencia,0.8);

    const lambdaDebil = 1.5 - 0.8545 * Math.pow(diferencia,0.8);

    if (ratingCasa >= ratingVisita) {
        return {
            lambdaCasa: lambdaFavorito,
            lambdaVisita: lambdaDebil
        };
    }

    return {
        lambdaCasa: lambdaDebil,
        lambdaVisita: lambdaFavorito
    };
}

function poisson(k, lambda) {
    return Math.exp(-lambda) *
           Math.pow(lambda, k) /
           factorial(k);
}

function factorial(n) {

    let f = 1;

    for (let i = 2; i <= n; i++)
        f *= i;

    return f;
}

function calcularMomiosGolesMasCasa(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;


    for (let golesCasa = 1; golesCasa <= 10; golesCasa++) {

	
	p0 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 1.5)
	p1 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 2.5)
	p2 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 3.5)
	p3 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 4.5)
	p4 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 5.5)
	p5 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 6.5)
	p6 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 7.5)
	p7 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 8.5)
	p8 += poisson(golesCasa, lambdaCasa);
	if(golesCasa > 9.5)
	p9 += poisson(golesCasa, lambdaCasa);
}

    return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}

function calcularMomiosGolesMenosCasa(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;


    for (let golesCasa = 0; golesCasa <= 9; golesCasa++) {

	
	p9 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 8.5)
	p8 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 7.5)
	p7 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 6.5)
	p6 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 5.5)
	p5 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 4.5)
	p4 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 3.5)
	p3 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 2.5)
	p2 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 1.5)
	p1 += poisson(golesCasa, lambdaCasa);
	if(golesCasa < 0.5)
	p0 += poisson(golesCasa, lambdaCasa);
}

    return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}

function calcularMomiosGolesMasVisita(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;


    for (let golesVisita = 1; golesVisita <= 10; golesVisita++) {

	
	p0 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 1.5)
	p1 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 2.5)
	p2 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 3.5)
	p3 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 4.5)
	p4 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 5.5)
	p5 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 6.5)
	p6 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 7.5)
	p7 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 8.5)
	p8 += poisson(golesVisita, lambdaVisita);
	if(golesVisita > 9.5)
	p9 += poisson(golesVisita, lambdaVisita);
}

    return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}

function calcularMomiosGolesMenosVisita(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;


    for (let golesVisita = 0; golesVisita <= 9; golesVisita++) {

	
	p9 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 8.5)
	p8 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 7.5)
	p7 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 6.5)
	p6 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 5.5)
	p5 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 4.5)
	p4 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 3.5)
	p3 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 2.5)
	p2 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 1.5)
	p1 += poisson(golesVisita, lambdaVisita);
	if(golesVisita < 0.5)
	p0 += poisson(golesVisita, lambdaVisita);
}

    return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}

function calcularMomiosGolesMasTotales(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;
    let p10 = 0;
    let p11 = 0;
    let p12 = 0;
    let p13 = 0;
    let p14 = 0;
    let p15 = 0;
    let p16 = 0;
    let p17 = 0;
    let p18 = 0;
    let p19 = 0;

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob =
                probCasa *
                poisson(golesVisita, lambdaVisita);
		
            if ((golesCasa + golesVisita) > 0.5)
	    	p0 += prob;
            if ((golesCasa + golesVisita) > 1.5)
                p1 += prob;
	    if ((golesCasa + golesVisita) > 2.5)
                p2 += prob;
	    if ((golesCasa + golesVisita) > 3.5)
	    	p3 += prob;
            if ((golesCasa + golesVisita) > 4.5)
                p4 += prob;
	    if ((golesCasa + golesVisita) > 5.5)
                p5 += prob;
            if ((golesCasa + golesVisita) > 6.5)
	    	p6 += prob;
            if ((golesCasa + golesVisita) > 7.5)
                p7 += prob;
	    if ((golesCasa + golesVisita) > 8.5)
                p8 += prob;
	    if ((golesCasa + golesVisita) > 9.5)
	    	p9 += prob;
            if ((golesCasa + golesVisita) > 10.5)
                p10 += prob;
	    if ((golesCasa + golesVisita) > 11.5)
                p11 += prob;
            if ((golesCasa + golesVisita) > 12.5)
	    	p12 += prob;
            if ((golesCasa + golesVisita) > 13.5)
                p13 += prob;
	    if ((golesCasa + golesVisita) > 14.5)
                p14 += prob;
	    if ((golesCasa + golesVisita) > 15.5)
	    	p15 += prob;
            if ((golesCasa + golesVisita) > 16.5)
                p16 += prob;
	    if ((golesCasa + golesVisita) > 17.5)
                p17 += prob;
            if ((golesCasa + golesVisita) > 18.5)
	    	p18 += prob;
            if ((golesCasa + golesVisita) > 19.5)
                p19 += prob;
        }
    }

return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        },
        {
            descripcion: "10.5",
            momio: +(1 / p10).toFixed(2)
        },
        {
            descripcion: "11.5",
            momio: +(1 / p11).toFixed(2)
        },
        {
            descripcion: "12.5",
            momio: +(1 / p12).toFixed(2)
        },
        {
            descripcion: "13.5",
            momio: +(1 / p13).toFixed(2)
        },
        {
            descripcion: "14.5",
            momio: +(1 / p14).toFixed(2)
        },
        {
            descripcion: "15.5",
            momio: +(1 / p15).toFixed(2)
        },         
	{
            descripcion: "16.5",
            momio: +(1 / p16).toFixed(2)
        },
        {
            descripcion: "17.5",
            momio: +(1 / p17).toFixed(2)
        },
        {
            descripcion: "18.5",
            momio: +(1 / p18).toFixed(2)
        },
        {
            descripcion: "19.5",
            momio: +(1 / p19).toFixed(2)
        }
    ];
}

function calcularMomiosGolesMenosTotales(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;
    let p10 = 0;
    let p11 = 0;
    let p12 = 0;
    let p13 = 0;
    let p14 = 0;
    let p15 = 0;
    let p16 = 0;
    let p17 = 0;
    let p18 = 0;
    let p19 = 0;

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob =
                probCasa *
                poisson(golesVisita, lambdaVisita);
	
            if ((golesCasa + golesVisita) < 0.5)
	    	p0 += prob;
            if ((golesCasa + golesVisita) < 1.5)
                p1 += prob;
	    if ((golesCasa + golesVisita) < 2.5)
                p2 += prob;
	    if ((golesCasa + golesVisita) < 3.5)
	    	p3 += prob;
            if ((golesCasa + golesVisita) < 4.5)
                p4 += prob;
	    if ((golesCasa + golesVisita) < 5.5)
                p5 += prob;
            if ((golesCasa + golesVisita) < 6.5)
	    	p6 += prob;
            if ((golesCasa + golesVisita) < 7.5)
                p7 += prob;
	    if ((golesCasa + golesVisita) < 8.5)
                p8 += prob;
	    if ((golesCasa + golesVisita) < 9.5)
	    	p9 += prob;
            if ((golesCasa + golesVisita) < 10.5)
                p10 += prob;
	    if ((golesCasa + golesVisita) < 11.5)
                p11 += prob;
            if ((golesCasa + golesVisita) < 12.5)
	    	p12 += prob;
            if ((golesCasa + golesVisita) < 13.5)
                p13 += prob;
	    if ((golesCasa + golesVisita) < 14.5)
                p14 += prob;
	    if ((golesCasa + golesVisita) < 15.5)
	    	p15 += prob;
            if ((golesCasa + golesVisita) < 16.5)
                p16 += prob;
	    if ((golesCasa + golesVisita) < 17.5)
                p17 += prob;
            if ((golesCasa + golesVisita) < 18.5)
	    	p18 += prob;
            if ((golesCasa + golesVisita) < 19.5)
                p19 += prob;
        }
    }

return [
        {
            descripcion: "0.5",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "1.5",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "2.5",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "3.5",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "4.5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "5.5",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "6.5",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "7.5",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "8.5",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "9.5",
            momio: +(1 / p9).toFixed(2)
        },
        {
            descripcion: "10.5",
            momio: +(1 / p10).toFixed(2)
        },
        {
            descripcion: "11.5",
            momio: +(1 / p11).toFixed(2)
        },
        {
            descripcion: "12.5",
            momio: +(1 / p12).toFixed(2)
        },
        {
            descripcion: "13.5",
            momio: +(1 / p13).toFixed(2)
        },
        {
            descripcion: "14.5",
            momio: +(1 / p14).toFixed(2)
        },
        {
            descripcion: "15.5",
            momio: +(1 / p15).toFixed(2)
        },         
	{
            descripcion: "16.5",
            momio: +(1 / p16).toFixed(2)
        },
        {
            descripcion: "17.5",
            momio: +(1 / p17).toFixed(2)
        },
        {
            descripcion: "18.5",
            momio: +(1 / p18).toFixed(2)
        },
        {
            descripcion: "19.5",
            momio: +(1 / p19).toFixed(2)
        }
    ];
}

function calcularMomiosResultado(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let pCasa = 0;
    let pEmpate = 0;
    let pVisita = 0;

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob =
                probCasa *
                poisson(golesVisita, lambdaVisita);

            if (golesCasa > golesVisita)
                pCasa += prob;
            else if (golesCasa === golesVisita)
                pEmpate += prob;
            else
                pVisita += prob;
        }
    }

    return [
        {
            descripcion: "casa",
            momio: +(1 / pCasa).toFixed(2)
        },
        {
            descripcion: "empate",
            momio: +(1 / pEmpate).toFixed(2)
        },
        {
            descripcion: "visita",
            momio: +(1 / pVisita).toFixed(2)
        }
    ];
}

function calcularMomiosDiferenciaCasa(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob =
                probCasa *
                poisson(golesVisita, lambdaVisita);
	
            if ((golesCasa - golesVisita) == 1)
	    	p0 += prob;
	    if ((golesCasa - golesVisita) == 2)
                p1 += prob;
	    if ((golesCasa - golesVisita) == 3)
	    	p2 += prob;
            if ((golesCasa - golesVisita) == 4)
                p3 += prob;
	    if ((golesCasa - golesVisita) == 5)
                p4 += prob;
            if ((golesCasa - golesVisita) == 6)
	    	p5 += prob;
            if ((golesCasa - golesVisita) == 7)
                p6 += prob;
	    if ((golesCasa - golesVisita) == 8)
                p7 += prob;
	    if ((golesCasa - golesVisita) == 9)
	    	p8 += prob;
            if ((golesCasa - golesVisita) == 10)
                p9 += prob;
           }
    }

return [
        {
            descripcion: "1",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "2",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "3",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "4",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "6",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "7",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "8",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "9",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "10",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}


function calcularMomiosDiferenciaVisita(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

    let p0 = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    let p4 = 0;
    let p5 = 0;
    let p6 = 0;
    let p7 = 0;
    let p8 = 0;
    let p9 = 0;

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob =
                probCasa *
                poisson(golesVisita, lambdaVisita);
	
            if ((golesCasa - golesVisita) == -1)
	    	p0 += prob;
	    if ((golesCasa - golesVisita) == -2)
                p1 += prob;
	    if ((golesCasa - golesVisita) == -3)
	    	p2 += prob;
            if ((golesCasa - golesVisita) == -4)
                p3 += prob;
	    if ((golesCasa - golesVisita) == -5)
                p4 += prob;
            if ((golesCasa - golesVisita) == -6)
	    	p5 += prob;
            if ((golesCasa - golesVisita) == -7)
                p6 += prob;
	    if ((golesCasa - golesVisita) == -8)
                p7 += prob;
	    if ((golesCasa - golesVisita) == -9)
	    	p8 += prob;
            if ((golesCasa - golesVisita) == -10)
                p9 += prob;
           }
    }

return [
        {
            descripcion: "1",
            momio: +(1 / p0).toFixed(2)
        },
        {
            descripcion: "2",
            momio: +(1 / p1).toFixed(2)
        },
        {
            descripcion: "3",
            momio: +(1 / p2).toFixed(2)
        },
        {
            descripcion: "4",
            momio: +(1 / p3).toFixed(2)
        },
        {
            descripcion: "5",
            momio: +(1 / p4).toFixed(2)
        },
        {
            descripcion: "6",
            momio: +(1 / p5).toFixed(2)
        },         
	{
            descripcion: "7",
            momio: +(1 / p6).toFixed(2)
        },
        {
            descripcion: "8",
            momio: +(1 / p7).toFixed(2)
        },
        {
            descripcion: "9",
            momio: +(1 / p8).toFixed(2)
        },
        {
            descripcion: "10",
            momio: +(1 / p9).toFixed(2)
        }
    ];
}


function calcularMomiosMarcadorExacto(ratingCasa, ratingVisita) {

    const { lambdaCasa, lambdaVisita } =
        calcularLambdas(ratingCasa, ratingVisita);

       const resultados = [];

    for (let golesCasa = 0; golesCasa <= 10; golesCasa++) {

        const probCasa = poisson(golesCasa, lambdaCasa);

        for (let golesVisita = 0; golesVisita <= 10; golesVisita++) {

            const prob = probCasa * poisson(golesVisita, lambdaVisita);

	resultados.push({
            descripcion: `${golesCasa}-${golesVisita}`,
            momio: +(1 / prob).toFixed(2)
                       });
        }
    }
return resultados;
}

function calcularMomios(ratingCasa, ratingVisita) {

    return {

        golesMasCasa: calcularMomiosGolesMasCasa(ratingCasa,ratingVisita),

        golesMenosCasa: calcularMomiosGolesMenosCasa(ratingCasa,ratingVisita),

        golesMasVisita: calcularMomiosGolesMasVisita(ratingCasa, ratingVisita),

        golesMenosVisita: calcularMomiosGolesMenosVisita(ratingCasa,ratingVisita),

        golesMasTotales: calcularMomiosGolesMasTotales(ratingCasa,ratingVisita),

        golesMenosTotales: calcularMomiosGolesMenosTotales(ratingCasa,ratingVisita),

        resultado: calcularMomiosResultado(ratingCasa,ratingVisita),

        diferenciaCasa: calcularMomiosDiferenciaCasa(ratingCasa,ratingVisita),

        diferenciaVisita: calcularMomiosDiferenciaVisita(ratingCasa,ratingVisita),

        marcadorExacto: calcularMomiosMarcadorExacto(ratingCasa,ratingVisita),
    };
}


const MOMIOS = {};

for (const id in PARTIDOS) {

    const partido = obtenerPartido(id);

    MOMIOS[id] = calcularMomios(
        partido.casa.rating,
        partido.visita.rating
    );
}


const HORAS_LIMITE = {
  "franciainglaterra": new Date("2026-08-18T20:50:00Z")
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
            "INSERT INTO ligas (nombre, administrador, codigo) VALUES ($1, $2, $3)",
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