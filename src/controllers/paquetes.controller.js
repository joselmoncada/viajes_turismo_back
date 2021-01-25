const DB = require('../../DataBase');
pool = DB.getPool()

const getPaquetes = async (req, res) => {
    console.log('get paquetes')
    const response = await pool.query('SELECT * FROM CJV_Paquete;');
    res.status(200).json(response.rows);
};

const getAgenciaByName = async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const response = await pool.query("SELECT id FROM CJV_Agencia as a WHERE a.nombre = $1",[nombre]);
        res.status(200).json(response.rows);
    } catch (e) {
        res.status(500).send('Error: ocurrio un problema a la hora ejecutar la consulta')
    }
};

const createPaquete = async (req, res, next) => {
    try {
        const { id_agencia, nombre,  descripcion, dias_duracion, max_num_viajeros } = req.body;
        console.log('create Paquete:', req.body)
        const response = await pool.query(`INSERT INTO CJV_Paquete
                                            (id_agencia, id, nombre, descripcion, dias_duracion, max_num_viajeros ) 
                                            VALUES ($1, NEXTVAL('cjv_s_paquete'), $2,$3,$4,$5);`,
                                            [id_agencia, nombre, descripcion, dias_duracion, max_num_viajeros]);
        res.status(200).json(response.rows);
    } catch (e) {
        res.status(500).send( e.detail);
    }
};

const getPaqueteById = async(req, res) =>{
    try {
        const id = req.query.id;
        console.log('get Paquete By Id: ', id)
        const response = await pool.query("SELECT * FROM CJV_PAQUETE where id = $1",[id]);
        res.status(200).json(response.rows[0])
    } catch (e) {
        res.status(500).send( e.detail);
    }
};



const getPaqueteByPk = async(req, res) =>{
    try {
        const id = req.query.id;
        const id_agencia = req.query.id_agencia;
        console.log('get Paquete By Pk: ', id_agencia, id)

        const response = await pool.query(`select paq.id_agencia, paq.id, nombre, 
                                            descripcion, dias_duracion,COALESCE(max_num_viajeros,0) max_num_viajeros, 
                                            COALESCE(num_contratos,0) num_contratos
                                            FROM cjv_paquete paq
                                                left join (select count(*) num_contratos, id_agencia, id_paquete 
                                                            from cjv_paquete_contrato 
                                                            group by id_agencia, id_paquete) cont
                                                    on cont.id_agencia = paq.id_agencia and cont.id_paquete = paq.id 
                                            where paq.id_agencia = $1 and id = $2;`,[id_agencia,id]);
        res.status(200).json(response.rows[0])
    } catch (e) {
        res.status(500).send(e)
    }
};

const getPrecioByPk= async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get Precio By Pk: ', id_agencia, id_paquete)

        const response = await pool.query(`select id_agencia, id_paquete, valor_base, fecha_inicio, fecha_fin, (fecha_inicio - current_date) tiempo_transcurrido 
                                            from cjv_historico_precio
                                            where id_agencia = $1 and id_paquete = $2 and fecha_fin is null`
                                            ,[id_agencia,id_paquete]);
        console.log('respuesta: ', response.rows)
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send(e)
    }
}

const getHistoricoPreciosByPk = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get historico Precio By Pk: ', id_agencia, id_paquete)

        const response = await pool.query(`select id_agencia, id_paquete, valor_base, fecha_inicio, fecha_fin, (fecha_inicio - current_date) tiempo_trancurrido 
                                            from cjv_historico_precio
                                            where id_agencia = $1 and id_paquete = $2`
                                            ,[id_agencia,id_paquete]);

        console.log('respuesta:', response.rows)                                     
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const getPaquetesDisponibles = async(req,res) => {
    try {
        const response = await pool.query(`select * from cjv_paquete paq
                                where id in(
                                        select id_paquete 
                                        from cjv_calendario_anual 
                                        where id_paquete = paq.id and fecha_salida > current_date) and
                                    id_agencia in(
                                        select id_agencia 
                                        from cjv_calendario_anual 
                                        where id_agencia = paq.id_agencia and fecha_salida > current_date) and
                                    id in(
                                        select id_paquete 
                                        from cjv_historico_precio 
                                        where id_paquete = paq.id and fecha_fin is null ) and
                                    id_agencia in(
                                        select id_agencia 
                                        from cjv_historico_precio 
                                        where id_agencia = paq.id_agencia and fecha_fin is null) and
                                    id in(
                                        select id_paquete 
                                        from cjv_itinerario 
                                        where id_paquete = paq.id) and
                                    id_agencia in(
                                        select id_agencia 
                                        from cjv_itinerario 
                                        where id_agencia = paq.id_agencia) and
                                    id in(
                                        select id_paquete 
                                        from cjv_servicio_detalle 
                                        where id_paquete = paq.id) and
                                    id_agencia in(
                                        select id_agencia 
                                        from cjv_servicio_detalle 
                                        where id_agencia = paq.id_agencia)  `)
                                    
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const deletePaquete = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.query
        console.log('delete Paquete', req.query)
        const response1 = await pool.query('delete from cjv_itin_atraccion where id_agencia = $1 and id_paquete = $2',
                                            [id_agencia,id_paquete])
        const response2 = await pool.query('delete from cjv_itinerario where id_agencia = $1 and id_paquete = $2;',
                                            [id_agencia,id_paquete])
        const response3 = await pool.query('delete from cjv_det_hotel where id_agencia = $1 and id_paquete = $2;',
                                            [id_agencia,id_paquete])
        const response4 = await pool.query('delete from cjv_servicio_detalle where id_agencia = $1 and id_paquete = $2;',
                                            [id_agencia,id_paquete])
        const response5 = await pool.query('delete from cjv_calendario_anual where id_agencia = $1 and id_paquete = $2;',
                                            [id_agencia,id_paquete])
        const response6 = await pool.query('delete from cjv_historico_precio where id_agencia = $1 and id_paquete = $2;',
                                            [id_agencia,id_paquete])
        const response7 = await pool.query(`delete from cjv_paquete where id_agencia = $1 and id = $2;`,
                                            [id_agencia,id_paquete]);                                   
        res.status(200).json(response7.rows)
        
    } catch (e) {
        res.status(500).send( e );
    }
}

const createPrecio = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, valor_base} = req.body
        console.log('create Precio: ', id_agencia, id_paquete, valor_base, ' \n');
        data = {
            id_agencia: id_agencia,
            id_paquete: id_paquete,
        }
        const response = await pool.query(`update cjv_historico_precio
                                            set fecha_fin = CURRENT_DATE
                                            where id_agencia = $1 and id_paquete = $2;`,
                                            [id_agencia,id_paquete,]);
        const response2 = await pool.query(`insert into cjv_historico_precio 
                                           values($1,$2,CURRENT_DATE,$3,null);`,
                                           [id_agencia,id_paquete,valor_base]);
        res.status(200).json(response.rows)
   } catch (e) {
       console.log(e)
        res.status(500).send( e.detail);
   }
}   


const updatePrecio = async(res,req) =>{
    try {
        const {id_agencia, id_paquete} = req.body;
        console.log('actualizar Precio: ', id_agencia, id_paquete);

        const response = await pool.query(`update cjv_historico_precio
                                                set fecha_fin = CURRENT_DATE
                                                where id_agencia = $1 and id_paquete = $2;`,
                                                [id_agencia,id_paquete,]);
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const getCalendarioDisponible = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get all Precio By Pk: ', id_agencia, id_paquete)

        const response = await pool.query(`select * 
                                            from cjv_calendario_anual
                                            where id_agencia = $1 and id_paquete = $2 and fecha_salida > current_date
                                            order by fecha_salida`
                                            ,[id_agencia,id_paquete]);

        console.log('respuesta:', response.rows)                                     
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const getHistoricoCalendario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get all Precio By Pk: ', id_agencia, id_paquete)

        const response = await pool.query(`select * 
                                            from cjv_calendario_anual
                                            where id_agencia = $1 and id_paquete = $2 `
                                            ,[id_agencia,id_paquete]);

        console.log('respuesta:', response.rows)                                     
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const createDateCalendario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, fecha_salida, descripcion} = req.body
        if(descripcion == null){
            descripcion = '-'
        }
        console.log('create Date Calendario: ', id_agencia, id_paquete, fecha_salida, descripcion)

        const response = await pool.query(`insert into cjv_calendario_anual
                                            values($1,$2,$3,$4)`
                                            ,[id_agencia,id_paquete,fecha_salida,descripcion]);

        console.log('respuesta:', response.rows)                                     
        res.status(200).json(response.rows)
    } catch (e) {
        if(e.code == 23505){
            console.log('llave duplicada')
            res.status(409).send( e.detail);
        }else{
            console.log(e)
            res.status(500).send( e.detail);
        }

    }
}

const getServiciosPaquete = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get Servicios Paquete: ', id_agencia, id_paquete)

        const response = await pool.query(`select s.id_agencia, s.id_paquete, s.id, s.nombre, s.descripcion, s.tipo_servicio,h.id id_hotel, h.nombre nombre_hotel, s.comida from  cjv_servicio_detalle s 
                                            left join cjv_det_hotel i on s.id_agencia = i.id_agencia and s.id_paquete = i.id_paquete and s.id = i.id_servicio
                                            left join cjv_lugar_hotel h on h.id = i.id_hotel
                                            where s.id_agencia = $1 and s.id_paquete = $2 `
                                            ,[id_agencia,id_paquete]);
        console.log(response.rows)                     
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const createServicioPaquete = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, tipo, nombre, descripcion, id_hotel, comida} = req.body

        console.log('create Servicio Paquete: ', id_agencia, id_paquete, tipo, nombre, descripcion, id_hotel,'comida:', comida)
        
        const response1 = await pool.query(`insert into cjv_servicio_detalle
                                            values($1,$2,nextval('cjv_s_servicio_detalle'),$3,$4,$5,$6)`
                                            ,[id_agencia,id_paquete,nombre,descripcion,tipo,comida]);
        if(id_hotel){ 
            const response2 = await pool.query(`select * from cjv_s_servicio_detalle`)
            id_servicio = response2.rows[0].last_value
             
            const response3 = await pool.query(`insert into cjv_det_hotel
                                                values($1,$2,$3,$4)`
                                                ,[id_agencia,id_paquete,id_servicio,id_hotel]);         
            res.status(200).json(response3.rows)
        } else {
            res.status(200).json(response1.rows)
        }           
        
    } catch (e) {
            console.log(e)
            res.status(500).send( e.detail);
    }
}

const deleteServicio = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id} = req.query
        console.log('delete Paquete', req.query)
        const response1 = await pool.query(`delete from cjv_det_hotel
                        where id_agencia = $1 and id_paquete = $2 and id_servicio = $3`,
                        [id_agencia, id_paquete, id])
        const response2 = await pool.query(`delete from cjv_servicio_detalle
                        where id_agencia = $1 and id_paquete = $2 and id = $3`,
                        [id_agencia, id_paquete, id])
        res.status(200).json(response2.rows)  
    } catch (e) {
        res.status(500).send( e );
    }
}


const getLugaresHoteltes = async (req,res) =>{
    try {
        //const {id_agencia, id_paquete} = req.body
        console.log('get Lugares Hoteltes: --- ')

        const response = await pool.query(`select h.id, nombre, h.id_pais, h.id_ciudad, 
                                                nombre_ciudad  
                                            from cjv_lugar_hotel h, (select 
                                                                        id_pais, id, 
                                                                        nombre nombre_ciudad 
                                                                        from cjv_ciudad) c
                                            where id_ciudad = c.id`);                            
        res.status(200).json(response.rows)
    } catch (e) {
        res.status(500).send( e.detail);
    }
}

const getElementoItinerarioById = async(req,res) =>{

};

const createElementoItinerario = async(req,res) =>{

};

const deleteElementoItinarario = async(req,res) =>{

};

const getItinerarioByPaquete = async(req,res) =>{

};





module.exports = {

    getPaquetes,
    getAgenciaByName,
    getPaqueteById,
    getPaqueteByPk,
    getPaquetesDisponibles,
    createPaquete,
    deletePaquete,

    getHistoricoPreciosByPk,
    getPrecioByPk,
    createPrecio,
    updatePrecio,
    
    getCalendarioDisponible,
    getHistoricoCalendario,
    createDateCalendario,
    
    getServiciosPaquete,
    createServicioPaquete,
    deleteServicio,
    getLugaresHoteltes,

}