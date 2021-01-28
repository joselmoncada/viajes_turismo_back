const DB = require('../../DataBase');
pool = DB.getPool()

const getPaquetes = async (req, res) => {
    try {
        console.log('get paquetes')
        const response = await pool.query('SELECT * FROM CJV_Paquete;');
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const getAgenciaByName = async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const response = await pool.query("SELECT id FROM CJV_Agencia as a WHERE a.nombre = $1",[nombre]);
        res.status(200).json(response.rows);
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const createPaquete = async (req, res, next) => {
    try {
        const { id_agencia, nombre,  descripcion, max_num_viajeros } = req.body;
        console.log('create Paquete ahora:', id_agencia, nombre,  descripcion, max_num_viajeros)
        const response = await pool.query(`INSERT INTO CJV_Paquete
                                            (id_agencia, id, nombre, descripcion, dias_duracion, max_num_viajeros ) 
                                            VALUES ($1, NEXTVAL('cjv_s_paquete'), $2,$3,0,$4);`,
                                            [id_agencia, nombre, descripcion, max_num_viajeros]);
        console.log('creado: ',response.rows)
        res.status(200).json(response.rows);
    } catch (e) {
        if(e.code == 23505){
            console.log('Error:', e.detail)
            res.status(409).send(e);
        }else{
            console.log('Error:', e.detail)
            res.status(500).send(e);
        }
    }
};

const getPaqueteById = async(req, res) =>{
    try {
        const id = req.query.id;
        console.log('get Paquete By Id: ', id)
        const response = await pool.query("SELECT * FROM CJV_PAQUETE where id = $1",[id]);
        res.status(200).json(response.rows[0])
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};



const getPaqueteByPk = async(req, res) =>{
    try {
        const id = req.query.id;
        const id_agencia = req.query.id_agencia;
        console.log('get Paquete By Pk: ', id_agencia, id)

        const response = await pool.query(`select paq.id_agencia, nombre_agencia, paq.id, nombre,  descripcion, 
                                                dias_duracion,COALESCE(max_num_viajeros,0) max_num_viajeros, 
                                                COALESCE(num_contratos,0) num_contratos
                                            FROM (select id, nombre nombre_agencia from cjv_agencia) agen,cjv_paquete paq
                                            left join (select count(*) num_contratos, id_agencia, id_paquete 
                                                from cjv_paquete_contrato 
                                            group by id_agencia, id_paquete) cont
                                                on cont.id_agencia = paq.id_agencia and cont.id_paquete = paq.id 
                                            where paq.id_agencia = agen.id and paq.id_agencia = $1 and paq.id = $2;`,[id_agencia,id]);
        res.status(200).json(response.rows[0])
    } catch (e) {
        console.log(e)
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
        console.log(e)
        res.status(500).send(e);
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
        console.log(e)
        res.status(500).send(e);
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
        console.log(e)
        res.status(500).send(e);
    }
}

const updateDuracionPaquete = async(req,res) =>{
    try{
        const { id_agencia, id_paquete, duracion} = req.body
        console.log('update Duracion Paquete: ', id_agencia, id_paquete, duracion)
        const response = await pool.query(`update cjv_paquete
                                    set dias_duracion = $1
                                    where id_agencia = $2 and id = $3`,
                                    [duracion, id_agencia, id_paquete])
    res.status(200).json(response.rows)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e);
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
        console.log(e)
        res.status(500).send(e);
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
        if(e.code == 23505){
            console.log(e.detail)
            res.status(409).send( e.detail);
        }else{
            console.log(e)
            res.status(500).send( e.detail);
        }

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
        console.log(e)
        res.status(500).send(e);
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
        console.log(e)
        res.status(500).send(e);
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
        console.log(e)
        res.status(500).send(e);
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
            console.log(e.detail)
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
        console.log(e)
        res.status(500).send(e);
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
        if(e.code == 23505){
            console.log(e.detail)
            res.status(409).send( e.detail);
        }else{
            console.log(e)
            res.status(500).send( e.detail);
        }
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
        console.log(e)
        res.status(500).send(e);
    }
}


const getLugaresHoteltes = async (req,res) =>{
    try {
        //const {id_agencia, id_paquete} = req.body
        console.log('get Lugares Hoteltes: --- ')

        const response = await pool.query(`
            select h.id, nombre, h.id_pais, h.id_ciudad, 
                nombre_ciudad  
            from cjv_lugar_hotel h, (select 
                id_pais, id, 
                nombre nombre_ciudad 
                from cjv_ciudad) c
            where id_ciudad = c.id`);                            
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const getElementoItinerarioById = async(req,res) =>{

};

const createElementoItinerario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete,secuencia, tiempo_estancia_dias, id_pais, id_ciudad} = req.body

        console.log('create Elemento Itinerario: ', id_agencia, id_paquete, secuencia, tiempo_estancia_dias, id_pais, id_ciudad)
        
        const response1 = await pool.query(`
            insert into cjv_itinerario
            values($1,$2,nextval('cjv_s_itinerario'),$3,$4,$5,$6)`,
            [id_agencia,id_paquete,secuencia,tiempo_estancia_dias,id_pais,id_ciudad]);
        res.status(200).json(response1.rows)   
    } catch (e) {
        if(e.code == 23505){
            console.log(e.detail)
            res.status(409).send( e.detail);
        }else{
            console.log(e)
            res.status(500).send( e.detail);
        }
    }
};

const getItinerarioByPaquete = async(req,res) =>{
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get Itinerario By Paquete: ', id_agencia, id_paquete)
        
        const response1 = await pool.query(` 
            select id_agencia, id_paquete, itin.id, secuencia, 
                tiempo_estancia_dias, itin.id_pais, pais.nombre_pais, 
                itin.id_ciudad, ciu.nombre_ciudad, 
                COALESCE(int.num_atracciones,0) num_atracciones
            from (select id_pais, id, nombre nombre_ciudad 
                    from cjv_ciudad) ciu, 
                (select id, nombre nombre_pais 
                    from cjv_pais) pais, 
                cjv_itinerario itin
            left join (select id_itinerario, count(*) num_atracciones 
                   from cjv_itin_atraccion 
                   where id_agencia = $1 and id_paquete = $2
                   group by id_itinerario) int 
                on int.id_itinerario = itin.id
            where itin.id_pais = ciu.id_pais and itin.id_ciudad = ciu.id and
                ciu.id_pais = pais.id
                and itin.id_agencia = $1 and itin.id_paquete = $2
            order by itin.id`,
        [id_agencia, id_paquete]);
        res.status(200).json(response1.rows)   
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const getAtraccionesByElementoItinerarioDisponible = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario} = req.body
        console.log('get Atracciones By Elemento Itinerario Disponible: ', id_agencia, id_paquete, id_itinerario)
        
        const response1 = await pool.query(` 
            select atr.id_pais, atr.id_ciudad, atr.id, atr.nombre, atr.descripcion, atr.url_imagen 
            from cjv_itinerario itin, cjv_atraccion atr
            where atr.id_pais = itin.id_pais and atr.id_ciudad = itin.id_ciudad and
                atr.id not in(select id_atraccion 
                      from cjv_itin_atraccion 
                      where id_agencia= $1 and id_paquete = $2 
                      and id_itinerario =$3)
            and id_agencia= $1 and id_paquete = $2 and itin.id =$3`,
            [id_agencia, id_paquete, id_itinerario]);
        res.status(200).json(response1.rows)   
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};



const getAtraccionesByElementoItinerario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario} = req.body
        console.log('get Atracciones By Elemento Itinerario: ', id_agencia, id_paquete, id_itinerario)
        
        const response1 = await pool.query(` 
            select atr.id_pais, atr.id_ciudad, atr.id, 
                atr.nombre, atr.descripcion, url_imagen, itin.orden   
            from cjv_atraccion atr, cjv_itin_atraccion itin
            where atr.id_pais = itin.id_pais and atr.id_ciudad = itin.id_ciudad 
                and atr.id = itin.id_atraccion and
                itin.id_agencia = $1 and itin.id_paquete = $2 and itin.id_itinerario = $3
            order by itin.orden`,
            [id_agencia, id_paquete, id_itinerario]);
        res.status(200).json(response1.rows)   
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const assignAtraccionesAElemento = async(req,res) =>{
    try {
        const {id_agencia, id_paquete,id_itinerario, id_pais, id_ciudad, id_atraccion, orden} = req.body

        console.log('assign Atracciones A Elemento: ', id_agencia, id_paquete,id_itinerario, id_pais, id_ciudad, id_atraccion)
        
        const response1 = await pool.query(`
            insert into cjv_itin_atraccion
            values($1,$2,$3,$4,$5,$6,$7)`,
            [id_agencia,id_paquete,id_itinerario,id_pais,id_ciudad,id_atraccion,orden]);
        res.status(200).json(response1.rows)   
    } catch (e) {
        if(e.code == 23505){
            console.log(e.detail)
            res.status(409).send( e.detail);
        }else{
            console.log(e)
            res.status(500).send( e.detail);
        }
    }
};
const updateSecuenciaElementoItinerario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario, secuencia} = req.body
        console.log('update Secuencia Elemento Itinerario', req.body)
        const response = await pool.query(`
            update cjv_itinerario 
                set secuencia = $1 
            where id_agencia = $2 and id_paquete = $3 and id = $4`,
            [secuencia,id_agencia,id_paquete,id_itinerario])                    
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const deleteElementoItinarario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario} = req.query
        console.log('delete Elemento Itinarario', req.query)
        const response1 = await pool.query('delete from cjv_itin_atraccion where id_agencia = $1 and id_paquete = $2 and id_itinerario = $3;',
                                            [id_agencia,id_paquete,id_itinerario])
        const response2 = await pool.query('delete from cjv_itinerario where id_agencia = $1 and id_paquete = $2 and id = $3;',
                                            [id_agencia,id_paquete,id_itinerario])                        
        res.status(200).json(response2.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const updateOrdenAtraccionesElementoItinerario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario, orden} = req.body
        console.log('update Orden Atracciones Elemento Itinerario', id_agencia, id_paquete, id_itinerario, orden)
        const response = await pool.query(`
            update cjv_itin_atraccion 
                set orden = $1 
            where id_agencia = $2 and id_paquete = $3 and id_itinerario = $4`,
            [orden,id_agencia,id_paquete,id_itinerario])                    
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};

const deleteAtraccionDeElementoItinarario = async(req,res) =>{
    try {
        const {id_agencia, id_paquete, id_itinerario, id_atraccion } = req.query
        console.log('delete Atraccion De Elemento Itinarario', req.query)
        const response = await pool.query(`
            delete from cjv_itin_atraccion 
            where id_agencia = $1 and id_paquete = $2 and id_itinerario = $3 and id_atraccion = $4;`,
            [id_agencia,id_paquete,id_itinerario,id_atraccion])                    
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
};



const getPaqueteEspecializaciones = async(req,res) =>{ 
    try {
        const {id_agencia, id_paquete} = req.body
        console.log('get Especializacion: ',id_agencia, id_paquete)

        const response = await pool.query(`select ai.id id_area_interes, esp.id, ai.nombre ,descripcion 
                        from cjv_area_interes ai,cjv_especializacion esp
                        where esp.id_area_interes = ai.id 
                        and id_agencia_paquete = $1 and id_paquete = $2`,
                        [id_agencia,id_paquete]);                            
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const createEspecializacion = async(req,res) =>{ 
    try {
        const {id_agencia, id_paquete, id_area_interes} = req.body
        console.log('create Especializacion: ',id_agencia, id_paquete, id_area_interes)

        const response = await pool.query(`insert into cjv_especializacion (id_area_interes, id, id_agencia, id_agencia_paquete, id_paquete)
                                            values($1,nextval('cjv_s_especializacion'),$2,$3,$4)`,
                                            [id_area_interes, id_agencia,id_agencia,id_paquete]);                            
        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
}

const deletePaqueteEspecializacion = async(req,res) =>{
    try {
        const {id_area_interes, id_especializacion  } = req.query
        console.log('delete Paquete Especializacion: ',id_area_interes, id_especializacion )

        const response = await pool.query(`delete from cjv_especializacion 
            where id_area_interes = $1 and id = $2`,
            [id_area_interes, id_especializacion]);  

        res.status(200).json(response.rows)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    } 
}

module.exports = {

    getPaquetes,
    getAgenciaByName,
    getPaqueteById,
    getPaqueteByPk,
    getPaquetesDisponibles,
    createPaquete,
    updateDuracionPaquete,
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

    getItinerarioByPaquete,
    createElementoItinerario,
    getAtraccionesByElementoItinerario,
    getAtraccionesByElementoItinerarioDisponible,
    assignAtraccionesAElemento,
    updateSecuenciaElementoItinerario,
    deleteElementoItinarario, 
    updateOrdenAtraccionesElementoItinerario,
    deleteAtraccionDeElementoItinarario,

    getPaqueteEspecializaciones,
    createEspecializacion,
    deletePaqueteEspecializacion,
}