const DB = require('../../DataBase');
pool = DB.getPool()

const getRallies = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_rally as r left join (Select Distinct id_rally from CJV_participacion ) as p on r.id = p.id_rally left join (Select Distinct id_rally as id_rally_2 from CJV_organizador ) as o on r.id = o.id_rally_2 left join (Select Distinct id_rally as id_rally_3 from CJV_circuito) as c on r.id = c.id_rally_3 left join (Select Distinct id_rally as id_rally_4 from CJV_premio) as pr on r.id = pr.id_rally_4 left join (Select Distinct id_rally as id_rally_5 from CJV_valoracion) as v on r.id = v.id_rally_5 order by r.id;');

    

    console.log(response.rows);

    res.status(200).json(response.rows);
};

const getRally = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_rally WHERE id = ' + req.params.id + ';');

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

const getOrganizadores = async (req, res) => {
    try {
    const response = await pool.query('SELECT id_agencia, num_cupos, nombre FROM CJV_organizador left join CJV_agencia on id_agencia = id where id_rally =' +  8 + ';');
    console.log(response.rows);

    res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
    }
};

const getPremios = async (req, res) => {
    try {
    const response = await pool.query('SELECT nombre, puesto_destino, detalle FROM CJV_premio where id_rally =' + req.params.id + 'order by puesto_destino;');
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
    getParticipantes,
    getRally,
    getPremios,
    getOrganizadores
}
