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
   
   res.status(200).json(response.rows);
};

const createRegion = async (req, res) =>{

    const {nombre} = req.body;
   const response = await pool.query('INSERT INTO region(nombre) VALUES ($1)', [nombre]);
   console.log(response);
   res.send('region creada con exito!');
};

module.exports = {
    getRegiones,
    createRegion
}