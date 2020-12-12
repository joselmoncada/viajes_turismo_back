const {Pool} = require('pg');

const pool = new Pool({
    host:'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'viajes',
    port: '5432'
});

const getRegiones = async (req, res) => {
   const response = await pool.query('SELECT * FROM region;');
   console.log(response.rows);
   res.send('regiones');
}

module.exports = {
    getRegiones
}