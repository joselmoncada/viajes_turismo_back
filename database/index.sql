CREATE DATABASE viajes;

CREATE TABLE region(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL
);

INSERT INTO region(nombre) VALUES ('Asia'), ('Europa'), ('Oceania'), ('Latinoamerica'), ('Norteamerica');