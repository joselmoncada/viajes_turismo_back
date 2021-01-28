const DB = require('../../DataBase');
pool = DB.getPool()

const getRallies = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_rally as r left join (Select Distinct id_rally from CJV_participacion ) as p on r.id = p.id_rally order by r.id;');

    

    console.log(response.rows);

    res.status(200).json(response.rows);
};

const getParticipantes = async (req, res) => {
    try {
    const response = await pool.query('SELECT * FROM CJV_participacion WHERE id_rally = ' + req.params.id + ';');
    console.log(response.rows);

    res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
    }
};

const createRally = async (req, res) => {
    try {
        const {id,nombre,fecha_inicio,fecha_limite,max_num_cupos,modalidad,costo_participacion,informacion} = req.body;
        console.log('Rally: '+JSON.stringify(req.body))
        const response = await pool.query("INSERT INTO CJV_RALLY (id,nombre,fecha_inicio,fecha_limite,max_num_cupos,modalidad,costo_participacion,informacion)"+
        "VALUES (NEXTVAL('cjv_s_rally'),$1,$2,$3,$4,$5,$6,$7)", [nombre,fecha_inicio,fecha_limite,max_num_cupos, modalidad,costo_participacion,informacion]);
        console.log(response);
        res.status(200).json("Rally :" + JSON.stringify(req.body) + " creado");
    } catch (error) {
        console.log(error);
    }
}

const deleteRally = async (req, res) => {
    try {
        
        console.log('Rally: ' + req.params.id);
        console.log("DELETE FROM CJV_rally WHERE id = " + req.params.id + ";");
        const response = await pool.query("DELETE FROM CJV_rally WHERE id = " + req.params.id + ";");
        console.log(response);
        res.status(200).json("Rally con el id: " + req.params.id + " eliminado");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRallies,
    createRally,
    deleteRally,
    getParticipantes
}
