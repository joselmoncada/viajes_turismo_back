const {pool} =  require('../controllers/index.controller');

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

    const response = await pool.query('SELECT * FROM CJV_Ciudad');
    console.log(response.rows);
    res.status(200).json(response.rows);
}

const getPaises = async(req, res) =>{

    const response = await pool.query('SELECT * FROM CJV_Pais');
    console.log(response.rows);
    res.status(200).json(response.rows);
}



const getAtracciones = async(req, res) =>{

    const response = await pool.query('SELECT * FROM CJV_Atraccion');
    console.log(response.rows);
    res.status(200).json(response.rows);
}

module.exports = {
    getRegiones,
    createRegion,
    getCiudades,
    getPaises,
    getAtracciones,
}