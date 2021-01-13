const DB = require('../../DataBase');
pool = DB.getPool()

const getRallies = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_Rally;');
    console.log(response.rows);

    res.status(200).json(response.rows);
};

const createRally = async (req, res) => {
    try {
        const {id,nombre,fecha_inicio,fecha_limite,max_num_cupos,modalidad,costo_participacion,informacion} = req.body;
        console.log('Rally: '+JSON.stringify(req.body))
        const response = await pool.query('INSERT INTO CJV_RALLY (id,nombre,fecha_inicio,fecha_limite,max_num_cupos,modalidad,costo_participacion,informacion)'+
        'VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [id,nombre,fecha_inicio,fecha_limite,max_num_cupos, modalidad,costo_participacion,informacion]);
        console.log(response);

        res.send('Rally creado con exito!');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRallies,
    createRally,
}
