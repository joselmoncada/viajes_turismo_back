
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
        const response = await pool.query(`select via.documento, via.primer_nombre, via.primer_apellido, via.fecha_nacimiento,
                                            via.genero, via.id_pais, pais.nacionalidad, via.segundo_nombre, via.segundo_apellido from cjv_viajero via
                                            left join cjv_pais pais on pais.id = via.id_pais
                                            where via.documento = $1`, 
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
        const response = await pool.query(`delete from cjv_viajero 
                                        where documento = $1 and documento not in (
                                        select id_viajero from cjv_registro_viajero where id_viajero = $1
                                        )`,[documento])
        res.send('viajero creado con exito!');
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
        const response = await pool.query(`insert into cjv_registro_viajero (id_agencia, id_viajero, fecha_inicio)
                                        values($1, $2, CURRENT_DATE)`,[id_agencia, id_viajero])
        console.log('registrar Viajero A Agencia: ',response);
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

const finalizarViajeroRelacionConAgenciaByIDViajero = async (req,res,next)=>{
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

const getRegistroViajeroVigente = async (req,res,next)=>{
	try {
		const id_viajero = req.query.id_viajero
		console.log('get Registro De Cliente:', id_viajero)
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
									viaj.primer_nombre as nombre_viajero, reg.fecha_inicio, fecha_fin 
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
		const id_viajero = req.query.id_viajero
		console.log('get Registro De Cliente:', id_viajero)
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
                                            viaj.primer_nombre as nombre_viajero, reg.fecha_inicio, fecha_fin 
                                            from cjv_registro_viajero as reg
                                            left join cjv_agencia as agen on id_agencia = agen.id
                                            left join cjv_viajero as viaj on id_viajero = viaj.documento
                                            WHERE reg.id_viajero = $1`,
									        [id_viajero])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

const getAgenciasAsociable = async(req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('get Agencias Asociable:',id_viajero)
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

const cantidadViajesIncluidoViajero = async(req,res,next)=>{
    try{
        const id_viajero = req.query.id_viajero
        console.log('get Agencias Asociable:',id_viajero)
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
    finalizarViajeroRelacionConAgenciaByIDViajero,
    getRegistroViajeroVigente,
    getTodosRegistrosViajero,
    getAgenciasAsociable,
    cantidadViajesIncluidoViajero
}