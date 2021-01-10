const { Pool } = require('pg');


// copiar el archivo cambiar el nombre a de la base de datos a DataBase.js
// colocar los datos para conectarse a la base de datos
const getPool = () => {
    const pool = new Pool({
        host:'localhost',
        user:'postgres',
        password:'123456',
        database:'viajes',
        port:'5432'
    });
    return pool
};

module.exports ={
    getPool
}