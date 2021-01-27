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
        const response = await pool.query("SELECT * FROM CJV_PAQUETE where id =$1",[id]);
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
/**Crea una orden de contrato */
    try {
        console.log("Body"+JSON.stringify(req.body));
        const {fecha_viaje, email_valoracion,id_paquete,id_vendedor,id_cliente} = req.body;

        /**ID_AGENCIA DESDE ID DEL PAQUETE */
        const res1 = await pool.query("SELECT * FROM CJV_PAQUETE where id =$1",[id_paquete]);
        const paquete = res1.rows[0];
        console.log("Paquete: "+ JSON.stringify(paquete));
        const id_paquete_agencia = paquete.id_agencia;

        /**OBTENGO OBJ PRECIO DESDE ID DEL PAQUETE Y AGENCIA */
        const res2 =  await pool.query(`SELECT * FROM CJV_HISTORICO_PRECIO 
        WHERE id_agencia=$1 and id_paquete=$2 and fecha_fin=null;`, [id_paquete_agencia, id_paquete]);
        let total_neto = 0;
        if(res2.rows.length>=0){
            total_neto = res2.rows[0].valor_base;
    
        }
        console.log("Total neto: "+ total_neto);

        /**OBTENGO REGISTRO_CLIENTE DADO EL ID DEL CLIENTE --> ID_AGENCIA_CLIENTE, FECHA_INICIO DE LA ASOCIACION*/
        const res3 =  await pool.query(`SELECT reg.id_agencia as id_agencia, agen.nombre as nombre_agencia, reg.id_cliente, 
        cli.nombre as nombre_cliente, reg.fecha_inicio as fecha_inicio, fecha_fin 
        from cjv_registro_cliente as reg
        left join cjv_agencia as agen on id_agencia = agen.id
        left join cjv_cliente as cli on id_cliente = cli.id
        WHERE reg.id_cliente = $1`,[id_cliente]);//cjv_registro_cliente
        let registro_cliente;
        console.log("registros del cliente: "+ JSON.stringify(res3.rows));

        //SI EL CLIENTE ESTA ASOCIADO A UNA AGENCIA SE DEBE ELIMINAR DICHA ASOCIACION

        if(res3.rows.length>=0){
           registro_cliente = res3.rows[0]
            if(registro_cliente.id_agencia != id_paquete_agencia){
                const res4 = await pool.query(`update cjv_registro_cliente
                                            set fecha_fin = CURRENT_DATE
                                            where fecha_fin is null and id_cliente = $1 `,
                                            [id_cliente]);
                registro_cliente = res4.rows;
                console.log('Finalizar Asociacion: '+JSON.stringify(registro_cliente));
            }

        }else{
            const res5 = await pool.query(`insert into cjv_registro_cliente(id_agencia, id_cliente, fecha_inicio)
									values($1,$2,CURRENT_DATE)`,
                                    [id_paquete_agencia, id_cliente]);
            registro_cliente = res5.rows;
           console.log("response Insert registro "+JSON.stringify(registro_cliente));
        }
      
        const fecha_registro_cliente = registro_cliente.fecha_inicio;
        
                  const response = await pool.query(`INSERT INTO CJV_PAQUETE_CONTRATO
                  (id,total_neto, fecha_creacion, fecha_aprobacion, fecha_viaje, num_factura, email_valoracion,id_agencia, id_paquete, id_vendedor, id_agencia_cliente, id_cliente, fecha_registro_cliente)
                   VALUES (nextval('cjv_s_paquete_contrato'),$1,CURRENT_DATE,CURRENT_DATE,$2,nextval('cjv_s_num_factura'), $3, $4 ,$5, $6, $7, $8, $9);`,
                   [total_neto, fecha_viaje, email_valoracion, id_paquete_agencia, paquete.id, id_vendedor, registro_cliente.id_agencia, id_cliente,  fecha_registro_cliente ]);
                   console.log(JSON.stringify(response));
                   //res.status(200).json(response.rows);
                   res.send("Contrato registrado exitosamente");
    } catch (error) {
        console.log(error);
    }
}

const getContratoId = async(req,res)=>{
   try {
    const {fecha_viaje, id_paquete,id_cliente}= req.body;
    const response = await pool.query(`SELECT id FROM CJV_PAQUETE_CONTRATO WHERE 
    fecha_viaje=$1 AND id_paquete=$2 AND id_cliente=$3
    `, [fecha_viaje, id_paquete,id_cliente]);
    res.status(200).json(response.rows);
   } catch (error) {
       console.log(error);
   }
}


const asociarFormaPago = async (req, res )=>{
    /**Asocia un cliente, instrumento de pago con un contrato */
    try {

        const {id_contrato, id_cliente, id_instrumento, tipo} = req.body;
        const response = await pool.query(`INSERT INTO CJV_FORMA_PAGO(id_contrato, id_cliente, id_instrumento, tipo )
        VALUES ($1,$2,$3,$4);`, [id_contrato, id_cliente, id_instrumento, tipo]);
        console.log(response);
        //res.status(200).json(response.rows);
        res.send("Froma de pago asociada exitosamente")
    } catch (error) {
        console.log(error);
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
    asociarFormaPago,
    getContratoId

}