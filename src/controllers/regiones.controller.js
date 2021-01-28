const DB = require('../../DataBase');
pool = DB.getPool()

//EXAMPLES
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

 

const getCiudades = async(req, res) =>{
    try{
        const response = await pool.query('SELECT * FROM CJV_Ciudad');
        res.status(200).json(response.rows)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getCiudadesByPais = async(req,res) =>{
    try{
        const{id_pais} = req.body
        const response = await pool.query(`select * from cjv_ciudad 
                            where id_pais = $1`,[id_pais])
        res.status(200).json(response.rows)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getPaises = async(req, res) =>{
    try{
        const response = await pool.query('SELECT * FROM CJV_Pais');
        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}



const getAtracciones = async(req, res) =>{
    try{
        const response = await pool.query('SELECT * FROM CJV_Atraccion');
        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getAtraccionesByPais = async(req, res) =>{
    try{
        const{ id_pais } = req.body
        console.log('get Atracciones By Pais:', id_pais)
        const response = await pool.query(`
            SELECT * 
            FROM CJV_Atraccion 
            where id_pais = $1`,
            [id_pais]);
        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getAtraccionesByCiudad = async(req, res) =>{
    try{
        const{id_pais, id_ciudad} = req.body
        console.log('get Atracciones By ciudad:', id_pais, id_ciudad)
        const response = await pool.query(`
            SELECT * 
            FROM CJV_Atraccion 
            where id_pais = $1 and id_ciudad = $2`,
            [id_pais, id_ciudad]);
        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

module.exports = {
    getRegiones,
    createRegion,
    getCiudades,
    getCiudadesByPais,
    getPaises,
    getAtracciones,
    getAtraccionesByPais,
    getAtraccionesByCiudad
}