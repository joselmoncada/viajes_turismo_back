const DB = require('../../DataBase');
pool = DB.getPool()

const getPaquetes = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_Paquete;');
    console.log(response.rows);

    res.status(200).json(response.rows);
};

const getAgenciaByName = async (req, res) => {
    try {
        console.log('PARAM2: ' + req);
        const response = await pool.query("SELECT id FROM CJV_Agencia as a WHERE a.nombre = '" + req + "';");
        console.log(response.rows);
        return (response.rows);
    } catch (error) {
        console.log(error)
    }

    //res.status(404).json({"error":"No se encuentra en BD"});
};


const createPaquete = async (req, res, next) => {

    
    try {
        const { agencia,nombre,  descripcion, dias_duracion, max_num_viajeros } = req.body;
        let id_agencia = []
        id_agencia = await getAgenciaByName(agencia);
        console.log('id '+ id_agencia[0].id);


        const response = await pool.query('INSERT INTO CJV_Paquete(id_agencia,nombre, descripcion, dias_duracion,max_num_viajeros) VALUES ($1,$2,$3,$4,$5)',
            [id_agencia[0].id, nombre, descripcion, dias_duracion, max_num_viajeros]);

        console.log(response);

        res.send('paquete creado con exito!');
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    getPaquetes,
    createPaquete,
    getAgenciaByName,
}