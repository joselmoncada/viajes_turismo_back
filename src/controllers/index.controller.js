const DB = require('../../DataBase');
pool = DB.getPool()


const getAgencias = async (req, res) =>{
    try{
                                    //no quitar el id de la consulta
        const response = await pool.query('SELECT id, nombre FROM CJV_Agencia');
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
}

const getAreaInteres = async (req, res) => {

    try{
        const response = await pool.query('SELECT nombre FROM CJV_Area_Interes');
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
    
}

const getAreaInteresByAgenciaID= async (req, res) => {

    try{
        const{id_agencia} = req.query;
        const response = await pool.query(`select ai.id, ai.nombre, ai.descripcion from cjv_area_interes ai, cjv_agen_int i
                        where ai.id = i.id_area_interes and  i.id_agencia = $1 `,
                        [id_agencia]);
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
    
}

const getAreaInteresByPaquetePK= async (req, res) => {

    try{
        const{id_agencia, id_paquete} = req.query;
        const response = await pool.query(`select ai.id, ai.nombre, ai.descripcion 
                            from  cjv_area_interes ai, cjv_agen_int i
                            where ai.id not in (
                                    select id_area_interes 
                                    from cjv_especializacion 
                                    where id_agencia = $1 and id_paquete = $2) 
                                and ai.id = i.id_area_interes and  i.id_agencia = $1   `,
                        [id_agencia, id_paquete]);
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
    
}

const getAsociaciones  = async (req, res) => {
    try{
        console.log('get asociaciones: ')

        const response = await pool.query(`SELECT socio.id_agencia1, agen1.nombre as nombre_agencia1, socio.id_agencia2,  
                                            agen2.nombre as nombre_agencia2, socio.fecha_inicio, socio.fecha_fin 
                                            FROM cjv_asociacion AS socio
                                                LEFT JOIN cjv_agencia AS agen1 ON agen1.id = socio.id_agencia1
                                                LEFT JOIN cjv_agencia AS agen2 ON agen2.id = socio.id_agencia2
                                            ORDER BY fecha_fin DESC,fecha_inicio DESC `);
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
}

// Aqui comienza el codigo de las asociaciones

const getAgenciasNoRelacionadasConAgencia = async (req, res) => {
    try{
        const id = req.query.id
        console.log('datos: ',id, req.query)
    
        const response = await pool.query(`Select * from cjv_agencia where 
                                            id not in (select id_agencia1 from cjv_asociacion where fecha_fin is null and  id_agencia2 = $1) 
                                            and id not in (select id_agencia2 from cjv_asociacion where fecha_fin is null and id_agencia1 = $1) 
                                            and id <> $1;`,[id]);
        console.log(response.rows);
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
}

const createAsociacion = async (req, res) => {
    try{
        const{id1, id2} = req.body
        console.log('createAsociacion: ',id1,id2)
    
        const response = await pool.query(`insert into cjv_asociacion(id_agencia1, id_agencia2, fecha_inicio)
                                            values($1,$2,CURRENT_DATE)`,[id1,id2]);
        console.log(response.rows);
        res.status(200).json(response.rows);
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
}

const finalizarAsociacion =  async (req, res) => {
    try{
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
    }catch(e){
        console.log('Error:',e)
        res.status(500).send(e)
    }
}



module.exports = {
    
    getAgencias,
    getAreaInteres,
    getAreaInteresByAgenciaID,
    getAreaInteresByPaquetePK,
    getAgenciasNoRelacionadasConAgencia,
    createAsociacion,
    finalizarAsociacion,
    getAsociaciones
}