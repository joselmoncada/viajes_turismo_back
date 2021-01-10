const {Pool} = require('pg');

const pool = new Pool({
    host:'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'viajes',
    port: '5432'
});


const getAgencias = async (req, res) =>{

    const response = await pool.query('SELECT nombre FROM CJV_Agencia');
    console.log(response.rows);
    res.status(200).json(response.rows);
}

const getAreaInteres = async (req, res) =>{

    const response = await pool.query('SELECT nombre FROM CJV_Area_Interes');
    console.log(response.rows);
    res.status(200).json(response.rows);
}



module.exports = {
    
    getAgencias,
    getAreaInteres,
    pool,
}