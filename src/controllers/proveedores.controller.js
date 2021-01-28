const { json } = require('express');
const DB = require('../../DataBase');
pool = DB.getPool()


const getHistoricoProveedor = async (req,res) =>{
    try{
        const response = await pool.query(`SELECT agen.id as id_agencia, agen.nombre as nombre_agencia, 
                        pro.id as id_proveedor, pro.nombre as nombre_proveedor, hist.fecha_inicio, hist.fecha_fin FROM cjv_historico_proveedor AS hist
                        LEFT JOIN  cjv_agencia AS agen ON agen.id = hist.id_agencia
                        LEFT JOIN cjv_proveedor AS pro ON  hist.id_proveedor = pro.id
                        ORDER BY hist.fecha_fin DESC, hist.fecha_inicio DESC`)
        res.status(200).json(response.rows)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    } 
}

const getProveedoresNoRelacionadosConAgencia = async (req,res) =>{
    try{
        const id = req.query.id
        const response = await pool.query(`SELECT id,nombre FROM cjv_proveedor
                                            WHERE id NOT IN (
                                                select id_proveedor from cjv_historico_proveedor
                                                 where fecha_fin is null and id_agencia =  $1) `
                                            , [id])
        res.status(200).json(response.rows)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const createAsociacionConProveedor = async (req, res) => {
    try{
        const{id_agencia, id_proveedor} = req.body
        console.log('createAsociacionConProveedor: ',id_agencia, id_proveedor)
    
        const response = await pool.query(`insert into cjv_historico_proveedor(id_agencia, id_proveedor, fecha_inicio)
                                            values($1,$2,CURRENT_DATE)`,[id_agencia,id_proveedor]);

        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const updateAsocacionConProveedor =  async (req, res) => {

    try{
        console.log('ejecutando')
        const id_agencia= req.query.id_agencia
        const id_proveedor= req.query.id_proveedor
        const fecha= req.query.fecha
        console.log('finalizarAsociacion: ',id_agencia, id_proveedor, fecha)
    
        const response = await pool.query(`UPDATE cjv_historico_proveedor
                                            SET fecha_fin = CURRENT_DATE
                                            WHERE id_agencia = $1 and id_proveedor = $2 and fecha_inicio = $3;`,
                                            [id_agencia, id_proveedor, fecha]);

        res.status(200).json(response.rows);
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

module.exports = {
    getHistoricoProveedor,
    getProveedoresNoRelacionadosConAgencia,
    createAsociacionConProveedor,
    updateAsocacionConProveedor
}