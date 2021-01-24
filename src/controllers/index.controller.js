const DB = require('../../DataBase');
pool = DB.getPool()


const getAgencias = async (req, res) =>{
    
                                    //no quitar el id de la consulta
    const response = await pool.query('SELECT id, nombre FROM CJV_Agencia');
    console.log('agencias', response.rows);
    res.status(200).json(response.rows);
}

const getAgenciaByName = async (req, res) => {
    try {
        console.log('Data: ' + req);
        console.log('Agencia: ' + req);
        const agencia = req;
        const response = await pool.query("SELECT id FROM CJV_Agencia as a WHERE a.nombre = '" + agencia + "';");
        console.log(response.rows);
        return (response.rows);
    } catch (error) {
        console.log(error)
    }

    //res.status(404).json({"error":"No se encuentra en BD"});
};


const getAreaInteres = async (req, res) => {
    const response = await pool.query('SELECT nombre FROM CJV_Area_Interes');
    console.log(response.rows);
    res.status(200).json(response.rows);
}

const getAsociaciones  = async (req, res) => {
    console.log('asociacion: ', req.query)

    const response = await pool.query(`SELECT socio.id_agencia1, agen1.nombre as nombre_agencia1, socio.id_agencia2,  
                                        agen2.nombre as nombre_agencia2, socio.fecha_inicio, socio.fecha_fin 
                                        FROM cjv_asociacion AS socio
                                            LEFT JOIN cjv_agencia AS agen1 ON agen1.id = socio.id_agencia1
                                            LEFT JOIN cjv_agencia AS agen2 ON agen2.id = socio.id_agencia2
                                        ORDER BY fecha_fin DESC,fecha_inicio DESC `);
    res.status(200).json(response.rows);
}

// Aqui comienza el codigo de las asociaciones

const getAgenciasNoRelacionadasConAgencia = async (req, res) => {
    const id = req.query.id
    console.log('datos: ',id, req.query)

    const response = await pool.query(`Select * from cjv_agencia where 
                                        id not in (select id_agencia1 from cjv_asociacion where fecha_fin is null and  id_agencia2 = $1) 
                                        and id not in (select id_agencia2 from cjv_asociacion where fecha_fin is null and id_agencia1 = $1) 
                                        and id <> $1;`,[id]);
    console.log(response.rows);
    res.status(200).json(response.rows);
}

const createAsociacion = async (req, res) => {
    const{id1, id2} = req.body
    console.log('createAsociacion: ',id1,id2)

    const response = await pool.query(`insert into cjv_asociacion(id_agencia1, id_agencia2, fecha_inicio)
                                        values($1,$2,CURRENT_DATE)`,[id1,id2]);
    console.log(response.rows);
    res.status(200).json(response.rows);
}

const finalizarAsociacion =  async (req, res) => {
    console.log('ejecutando')
    const id1= req.query.id1
    const id2= req.query.id2
    const fecha= req.query.fecha
    console.log('finalizarAsociacion: ',id1, id2, fecha)

    const response = await pool.query(`UPDATE cjv_asociacion
                                        SET fecha_fin = CURRENT_DATE
                                        WHERE id_agencia1 = $1 and id_agencia2 = $2 and fecha_inicio = $3;`,
                                        [id1,id2,fecha]);
    console.log(response.rows);
    res.status(200).json(response.rows);
}



module.exports = {
    
    getAgencias,
    getAreaInteres,
    getAgenciasNoRelacionadasConAgencia,
    createAsociacion,
    finalizarAsociacion,
    getAsociaciones,
    getAgenciaByName,
}