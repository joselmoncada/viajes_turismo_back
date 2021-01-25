const DB = require('../../DataBase');
pool = DB.getPool()

const getPaquetes = async (req, res) => {

    const response = await pool.query('SELECT * FROM CJV_Paquete;');
    console.log(response.rows);

    res.status(200).json(response.rows);
};

const { getAgenciaByName } = require('../controllers/index.controller');
const { getClienteByID, finalizarClienteRelacionConAgenciasByIDCliente, registrarClienteAAgencia } = require('./cliente.controller');



const createPaquete = async (req, res, next) => {

    
    try {
        const { agencia,nombre,  descripcion, dias_duracion, max_num_viajeros } = req.body;
        let id_agencia = []
        id_agencia = await getAgenciaByName(agencia);
        console.log('id '+ id_agencia[0].id);


        const response = await pool.query("INSERT INTO CJV_Paquete(id_agencia,nombre, descripcion, dias_duracion,max_num_viajeros, id) VALUES ($1,$2,$3,$4,$5,NEXTVAL('cjv_s_paquete'))",
            [id_agencia[0].id, nombre, descripcion, dias_duracion, max_num_viajeros]);

        console.log(response);

        res.send('paquete creado con exito!');
    } catch (e) {
        return next(e);
    }
};

const deletePaquete = async(req, res, next) =>{ //no se como logre este pero funciona
    try {
        console.log('id paquete: ' + req.params.id);
        console.log(("DELETE id FROM CJV_Paquete as p WHERE p.id  = " + req.params.id + ";"));
        const response = await pool.query("DELETE FROM CJV_Paquete as p WHERE p.id  = " + req.params.id + ";");
        return (response.rows);
    } catch (error) {
        console.log(error)
    }
}

const getPaqueteById = async(req, res) =>{
    try {
        const id = req.query.id;
        const response = await pool.query("SELECT * FROM CJV_PAQUETE where id ="+id);
        return (response.rows[0].body);
    } catch (error) {
        console.log(error);
    }
}


const getPrecioPaquete = async(req, res) =>{
    try {
        const agencia = req.query.id_agencia;
        const paquete = req.query.id_paquete;
        
        var currentDate = new Date().toLocaleString().slice(0,10);
        const response = await pool.query(`SELECT * FROM CJV_HISTORICO_PRECIO
         WHERE id_agencia=$1 and id_paquete=$2 and fecha_fin=null;`, [agencia, paquete]);
         return res.status(200).json(response.rows);


    } catch (error) {
        console.log(error);
    }
}

const createPaqueteContrato = async (req, res)=>{

    try {

        const paquete = getPaqueteById(id_paquete);
        const total_neto = getPrecioPaquete(id_paquete, id_agencia);
        const id_paquete_agencia = paquete.id_agencia;
        const registro_cliente = getRegistroClienteById(id_cliente); //cjv_registro_cliente
        //SI EL CLIENTE ESTA ASOCIADO A UNA AGENCIA SE DEBE ELIMINAR DICHA ASOCIACION
        if(registro_cliente.id_agencia != id_paquete_agencia){
            finalizarClienteRelacionConAgenciasByIDCliente(id_cliente);
        }
        registrarClienteAAgencia(id_paquete_agencia, id_cliente);
        const fecha_registro_cliente = registro_cliente.fecha_inicio;
        
        
        
        const {fecha_viaje, email_valoracion,id_paquete,id_vendedor,id_cliente} = req.body;

                  const response = await pool.query(`INSERT INTO CJV_PAQUETE_CONTRATO
                  (id,total_neto, fecha_creacion, fecha_aprobacion, fecha_viaje, num_factura, email_valoracion,id_agencia, id_paquete, id_vendedor, id_agencia_cliente, id_cliente, fecha_registro_cliente)
                   VALUES (nextval('cjv_s_paquete_contrato'),$1,CURRENT_DATE,CURRENT_DATE,$2,nextval('cjv_s_num_factura'), $3, $4,$4, $5,$6,$7,$8,$9 );`,
                   [total_neto,fecha_viaje,email_valoracion,id_paquete_agencia,paquete,id_vendedor, registro_cliente.id_agencia, id_cliente,  fecha_registro_cliente ]);
    } catch (error) {
        
    }
}

module.exports = {
    getPaquetes,
    createPaquete,
    getAgenciaByName,
    getPaqueteById,
    deletePaquete,
    getPrecioPaquete,
    createPaqueteContrato,

}