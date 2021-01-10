const { pool } = require('../controllers/index.controller');


const getPaquetes = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_Paquete;');
    console.log(response.rows);

    res.status(200).json(response.rows);
};

const getAgenciaByName = async (req, res) =>{
    console.log('PARAM2: '+ req);
    const response = await pool.query("SELECT id FROM CJV_Agencia as a WHERE a.nombre = '"+ req+"';");
    return res.status(200).json(response.rows);
    //res.status(404).json({"error":"No se encuentra en BD"});
}

const createPaquete = async (req, res) => {

    const { nombre, agencia, descripcion, dias_duracion, max_num_viajeros } = req.body;
    try {
        const id_agencia = getAgenciaByName(agencia);


        const response = await pool.query('INSERT INTO CJV_Paquete(id_agencia,nombre, descripcion, dias_duracion,max_num_viajeros) VALUES ($1,$2,$3,$4,$5)',
            [id_agencia, nombre, descripcion, dias_duracion, max_num_viajeros]);

        console.log(response);

        res.send('paquete creado con exito!');
    } catch (e) {
        console.log(e.body);
    }
};

module.exports = {
    getPaquetes,
    createPaquete,
    getAgenciaByName,
}