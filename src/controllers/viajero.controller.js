
const DB = require('../../DataBase');
pool = DB.getPool()

const getViajeros = async (req,res,next)=>{
    try{
        const response = await pool.query(`select * from cjv_viajero`)
        res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const getViajero = async (req,res,next)=>{
    try{  
        const documento = req.query.documento
        console.log('get Viajero By Documento: ', documento)
        const response = await pool.query(` SELECT documento, primer_nombre, primer_apellido, fecha_nacimiento, 
                                            genero,id_pais, pais.nacionalidad, segundo_nombre, segundo_apellido, 
                                            COALESCE( reg.total, 0 ) num_viajes 
                                            FROM cjv_viajero
                                            left join(
                                                    select count(*) as total, id_viajero 
                                                    from cjv_cont_reg_viajero 
                                                    group by id_viajero) reg
                                                on reg.id_viajero = documento
                                            left join cjv_pais pais on id_pais = pais.id
                                            where documento = $1`, 
                                        [documento])
        console.log(response.rows)
        res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const getViajerosNoClientes = async (req,res,next)=>{ 
	try {
		const response = await pool.query(`select documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento  
                                            from cjv_viajero
                                            where documento not in(
                                                select documento 
                                                from cjv_cliente 
                                                where documento is not null)`)
		
		res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const createViajero = async (req,res,next)=>{
    try{
    const {documento, primer_nombre, primer_apellido, fecha_nacimiento, 
        genero, id_pais, segundo_nombre, segundo_apellido } = req.body;
    console.log('create Viajero: ', req.body);
    const response = await pool.query('INSERT INTO cjv_viajero values($1,$2,$3,$4,$5,$6,$7,$8)', 
                                        [documento, primer_nombre, primer_apellido, fecha_nacimiento,
                                            genero, id_pais, segundo_nombre, segundo_apellido]);
    res.send('viajero guardado');
    } catch (e) {
        console.log(e)
        return next(e.detail);
    }
}

const deleteViajero = async (req,res,next)=>{
    try{
        const documento = req.query.documento
        console.log('delete Viajero: ',documento);
            const response2 = await pool.query(`delete from cjv_registro_viajero where id_viajero = $1`,[documento])
            const response3 = await pool.query(`delete from cjv_pasaporte where id_viajero = $1`,[documento])
            const response4 = await pool.query(`delete from cjv_viajero where documento = $1`,[documento])
            res.status(200)
            res.send('Se elimino correctamente la informacion');
            
    } catch (e) {
        return next(e);
    }
}



const createPasaporte = async (req,res,next)=>{
    try{ 
        const { id_pais, id_viajero, num_pasaporte, fecha_vencimiento } = req.body;
        const response = await pool.query('insert into cjv_pasaporte values($1, $2, $3, $4)', 
                                        [id_pais, id_viajero, num_pasaporte, fecha_vencimiento]);
        console.log('create Pasaporte: ', response);
        res.send('viajero creado con exito!'); 
    } catch (e) {
        return next(e);
    }
}

const getPasaportesDeViajero = async (req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('get Pasaportes De Viajero: ', id_viajero);
        const response = await pool.query(`select * from cjv_pasaporte where id_viajero = $1`, 
                                    [id_viajero])
        res.status(200).json(response.rows)
    } catch (e) {
    return next(e);
    }
}

const getPasaportesDeViajeroVigentes = async (req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('get pasaportes De Viajero Vigentes: ', id_viajero);
        const response = await pool.query(`select pas.num_pasaporte, pas.id_pais, pais.nombre, pas.fecha_vencimiento 
                                            from cjv_pasaporte pas 
                                            left join cjv_pais pais on pais.id = pas.id_pais
                                            where id_viajero = $1 and fecha_vencimiento > CURRENT_DATE`, 
                                    [id_viajero])
        res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const deletePasaporte = async (req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        const id_pais = req.query.id_pais
        const numero = req.query.num_pasaporte
        console.log('delete Pasaporte: ', req.query);
        const response = await pool.query(`delete from cjv_pasaporte 
                        where id_viajero = $1 and id_pais = $2 and num_pasaporte = $3`,
                        [id_viajero,id_pais,numero])
        console.log('delete Pasaporte: ',response);
        res.send('viajero creado con exito!');
    } catch (e) {
        return next(e);
    }
}

const registrarViajeroAAgencia = async (req,res,next)=>{
    try{
        const {id_agencia,id_viajero} = req.body
        console.log('registrar Cliente A Agencia:', id_agencia, id_viajero)
        const response = await pool.query(`insert into cjv_registro_viajero (id_agencia, id_viajero, fecha_inicio)
                                        values($1, $2, CURRENT_DATE)`,[id_agencia, id_viajero])

        res.send('viajero creado con exito!');
    } catch (e) {
        return next(e);
    }
}

const finalizarViajeroRelacionConAgencia = async (req,res,next)=>{
    try{
        const id_agencia= req.query.id_agencia
        const id_viajero= req.query.id_viajero
        const fecha= req.query.fecha
        console.log('finalizar Relacion Con Agencia: ',req.query)

        const response = await pool.query(`update cjv_registro_viajero
                                        set fecha_fin = CURRENT_DATE
                                        where id_agencia = $1 and id_viajero = $2 and fecha_inicio = $3`,
                                        [id_agencia,id_viajero,fecha]);
        console.log(response.rows);
        res.status(200).json(response.rows);
    } catch (e) {
        return next(e);
    }
}

const finalizarViajeroRelacionConAgenciasByIDViajero = async (req,res,next)=>{
    try{
        const id_viajero= req.query.id_viajero
        console.log('finalizar Relacion Con Agencia By ID Viajero: ',req.query)

        const response = await pool.query(`update cjv_registro_viajero
                                        set fecha_fin = CURRENT_DATE
                                        where fecha_fin is null and id_viajero = $1 `,
                                        [id_viajero]);
        console.log(response.rows);
        res.status(200).json(response.rows);
    } catch (e) {
        return next(e);
    }
}

const getViajerosAsociadoAgencia = async (req,res)=>{
    /**viajeros actualmente asociados a agencia en especifico */
	try {
		const id_agencia = req.query.id_agencia;
		console.log('get viajeros asociados a:'+id_agencia);
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
									viaj.primer_nombre, viaj.primer_apellido, reg.fecha_inicio, fecha_fin 
									from cjv_registro_viajero as reg
 	 									left join cjv_agencia as agen on id_agencia = agen.id
 										left join cjv_viajero as viaj on id_viajero = viaj.documento
									WHERE fecha_fin is null and reg.id_agencia = $1`,[id_agencia]);
		res.status(200).json(response.rows);
	} catch (e) {
		console.log(error);
	}
}


const getRegistroViajeroVigente = async (req,res,next)=>{
	try {
		const id_viajero = req.query.id_viajero
		console.log('get Registro De Viajero Vigente:', id_viajero)
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
									viaj.primer_nombre as nombre_viajero, viaj.primer_apellido, reg.fecha_inicio, fecha_fin 
									from cjv_registro_viajero as reg
 	 									left join cjv_agencia as agen on id_agencia = agen.id
 										left join cjv_viajero as viaj on id_viajero = viaj.documento
									WHERE fecha_fin is null and reg.id_viajero = $1`,
									[id_viajero])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}



const getTodosRegistrosViajero = async (req,res,next)=>{
	try {
		const id_viajero = req.query.id_viajero;
		console.log('get Registro De Viajero:'+ id_viajero);
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
                                            viaj.primer_nombre as nombre_viajero, reg.fecha_inicio, fecha_fin 
                                            from cjv_registro_viajero as reg
                                            left join cjv_agencia as agen on id_agencia = agen.id
                                            left join cjv_viajero as viaj on id_viajero = viaj.documento
                                            WHERE reg.id_viajero = $1`,
									        [id_viajero]);
		res.status(200).json(response.rows);
	} catch (e) {
		return next(e);
	}
}

const getViajerosRegistrados = async (req,res,next)=>{
	try {
		const response = await pool.query(`select * from cjv_registro_viajero`);
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

const getViajeroAgenciasAsociables = async(req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('get Viajero Agencias Asociable:',id_viajero)
        const response = await pool.query(`select id,nombre from cjv_agencia
                                            where id not in(
                                                select id_agencia 
                                                from cjv_registro_viajero 
                                                where fecha_fin is null 
                                                    and id_viajero= $1)`,
                                            [id_viajero])
        console.log(response.rows)
        res.status(200).json(response.rows)
    } catch(e){
        return next(e);
    }
}

//deprecate, ya se puede obtener este valor directamente en la consulta del viajero
const cantidadViajesIncluidoViajero = async(req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('cantidad Viajes Incluido Viajero:',id_viajero)
        const response = await pool.query(`select count(id_viajero) cantidad from cjv_cont_reg_viajero
                                            where id_viajero = $1`,
                                            [id_viajero])
        res.status(200).json(response.rows)
    } catch(e){
        return next(e);
    }
}

module.exports = {
    createViajero,
    deleteViajero,
    getViajeros,
    getViajero,
    getViajerosNoClientes,
    createPasaporte,
    getPasaportesDeViajero,
    getPasaportesDeViajeroVigentes,
    deletePasaporte,

    registrarViajeroAAgencia,
    finalizarViajeroRelacionConAgencia,
    finalizarViajeroRelacionConAgenciasByIDViajero,
    getRegistroViajeroVigente,
    getTodosRegistrosViajero,
    getViajeroAgenciasAsociables,
    cantidadViajesIncluidoViajero,
    getViajerosRegistrados,
    getViajerosAsociadoAgencia
}