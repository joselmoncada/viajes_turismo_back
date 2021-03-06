const DB = require('../../DataBase');
pool = DB.getPool()

const getRallies = async (req, res) => {

    const response = await pool.query(`
        SELECT * FROM CJV_rally as r 
            left join (
                Select Distinct id_rally 
                from CJV_participacion ) as p on r.id = p.id_rally 
            left join (Select Distinct id_rally as id_rally_2 
                from CJV_organizador ) as o on r.id = o.id_rally_2 
            left join (Select Distinct id_rally as id_rally_3 
                from CJV_circuito) as c on r.id = c.id_rally_3 
            left join (Select Distinct id_rally as id_rally_4 
                from CJV_premio) as pr on r.id = pr.id_rally_4 
            left join (Select Distinct id_rally as id_rally_5 
                from CJV_valoracion) as v on r.id = v.id_rally_5 
        order by r.id;`);

        
    res.status(200).json(response.rows);
};

const getRally = async (req, res) => {
    
    console.log('get Rally:', req.params.id)
    const response = await pool.query('SELECT * FROM CJV_rally WHERE id = $1;',[req.params.id]);

    console.log(response.rows);

    res.status(200).json(response.rows);
};

const getParticipantes = async (req, res) => {
    try {
    console.log('get Participantes:', req.params.id)
    const response = await pool.query(`
        Select p.id, p.num_participacion, p.puesto_final, 
            p.fecha_culminacion, p.id_viajero, c.documento 
        from cjv_participacion as p 
        left join cjv_cliente as c on p.id_cliente = c.id 
        WHERE id_rally = $1;`,
        [req.params.id]);
    console.log(response.rows);

    res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
    }
};

const getParticipantesData = async(req,res) =>{
    try{
        const id = req.params.id
        console.log('get Participantes Data: ',id, '\n \n  \n')
        const response = await pool.query(`
        select part.id, num_participacion, puesto_final, fecha_culminacion, 
	        via.documento documento_v, via.primer_nombre nombre_v, via.primer_apellido apellido_v, 
	        cli.id, cli.documento documento_c ,cli.nombre nombre_c, cli.primer_apellido apellido_c from cjv_participacion part
        left join cjv_viajero via on part.id_viajero = via.documento
        left join cjv_cliente cli on part.id_cliente = cli.id
        where id_rally = $1
        order by num_participacion
        `,[id])

        res.status(200).json(response.rows)
    }catch(e){
        console.log('Error: ', e)
        res.status(500).send(e)
    }
}

const getOrganizadores = async (req, res) => {
    try {
    const id = req.params.id
    console.log('get Organizadores:', id);
    const response = await pool.query(`
        SELECT id_agencia, id_rally, num_cupos, nombre 
        FROM CJV_organizador 
        left join CJV_agencia on id_agencia = id 
        where id_rally = $1 ;`,
        [id]);

    console.log(response.rows);

    res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
    }
};

const getPremios = async (req, res) => {
    try {
    const response = await pool.query( `
        SELECT id, nombre, puesto_destino, detalle 
        FROM CJV_premio where id_rally =$1 
        order by puesto_destino;`, 
        [req.params.id]);
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
        const response = await pool.query(`
            INSERT INTO CJV_RALLY (id,nombre,fecha_inicio,fecha_limite,max_num_cupos,modalidad,costo_participacion,informacion)
            VALUES (NEXTVAL('cjv_s_rally'),$1,$2,$3,$4,$5,$6,$7)`, 
            [nombre,fecha_inicio,fecha_limite,max_num_cupos, modalidad,costo_participacion,informacion]);
        
        res.status(200).json("Rally :" + JSON.stringify(req.body) + " creado");
    } catch (error) {        
        console.log(error);
    }
}

const createPremio = async (req, res) => {
    try {

        const {id_rally,nombre,puesto_destino,detalle} = req.body;
        console.log('Rally: '+JSON.stringify(req.body))
        const response = await pool.query(`
            INSERT INTO CJV_premio (id_rally,id,nombre,puesto_destino,detalle)
            VALUES ($1,NEXTVAL('cjv_s_premio'),$2,$3,$4)`, 
            [id_rally,nombre,puesto_destino,detalle]);
        
        res.status(200).json("Premio :" + JSON.stringify(req.body) + " creado");
    } catch (error) {        
        console.log(error);
    }
}

const deleteRally = async (req, res) => {
    try {
        
        console.log('Rally: ' + req.params.id);
        console.log("DELETE FROM CJV_rally WHERE id = $1;",[ req.params.id ]);
        const response = await pool.query("DELETE FROM CJV_rally WHERE id = $1;",[req.params.id]);
        console.log(response);
        res.status(200).json("Rally con el id: " + req.params.id + " eliminado");
    } catch (error) {
        console.log(error);
    }
}

const deleteOrganizador = async (req, res) => {
    try {
        
        console.log('Organizador: ' + req.params.id);
        
        const response = await pool.query("DELETE FROM CJV_organizador WHERE id_agencia = $1;",[req.params.id]);
        console.log(response);
        res.status(200).json("Organizador eliminado");
    } catch (error) {
        console.log(error);
    }
}

const deletePremio = async (req, res) => {
    try {
        
        console.log('Premio: ' + req.params.id);
        
        const response = await pool.query("DELETE FROM CJV_premio WHERE id = $1;",[req.params.id]);
        console.log(response);
        res.status(200).json("Premio con el id: " + req.params.id + " eliminado");
    } catch (error) {
        console.log(error);
    }
}

const deleteParticipante = async (req, res) => {
    try {
        
        console.log('Participacion: ' + req.params.id);
        
        const response = await pool.query("DELETE FROM CJV_participacion WHERE id = $1;",[req.params.id]);
        console.log(response);
        res.status(200).json("Participacion con el id: " + req.params.id + " eliminado");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRallies,
    createRally,
    deleteRally,
    getParticipantes,
    getParticipantesData,
    getRally,
    getPremios,
    getOrganizadores,
    deleteOrganizador,
    deletePremio,
    deleteParticipante, 
    createPremio
}
