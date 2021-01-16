
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
        const response = await pool.query(`select * from cjv_viajero
                                        where documento = $1`, 
                                        [documento])
    
        res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const createViajero = async (req,res,next)=>{
    const {documento, primer_nombre, primer_apellido, fecha_nacimiento, 
        genero, id_pais, segundo_nombre, segundo_apellido } = req.body;
    console.log('create Viajero: ', req.body);
    const response = await pool.query('INSERT INTO cjv_viajero values($1,$2,$3,$4,$5,$6,$7,$8)', 
                                        [documento, primer_nombre, primer_apellido, fecha_nacimiento,
                                            genero, id_pais, segundo_nombre, segundo_apellido]);
    console.log('create Viajero: ', response);
    res.send('viajero creado con exito!');
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
        const response = await pool.query(`select * from cjv_pasaporte where id_viajero = $1 and fecha_vencimiento > CURRENT_DATE`, 
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
        const id_agencia = req.query.id_agencia
        const id_viajero = req.query.id_viajero
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

const getRegistroDeViajero = async (req,res,next)=>{
	try {
		const id_agencia = req.query.id_agencia
		const id_viajero = req.query.id_viajero
		console.log('get Registro De Cliente:',id_agencia, id_viajero)
		const response = await pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_viajero, 
									viaj.primer_nombre as nombre_viajero, reg.fecha_inicio, fecha_fin 
									from cjv_registro_viajero as reg
 	 									left join cjv_agencia as agen on id_agencia = agen.id
 										left join cjv_viajero as viaj on id_viajero = viaj.documento
									WHERE fecha_fin is null and reg.id_agencia = $1 and reg.id_viajero = $2`,
									[id_agencia, id_viajero])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

module.exports = {
    createViajero,
    deleteViajero,
    getViajeros,
    getViajero,
    createPasaporte,
    getPasaportesDeViajero,
    getPasaportesDeViajeroVigentes,
    deletePasaporte,
    registrarViajeroAAgencia,
    finalizarViajeroRelacionConAgencia,
    getRegistroDeViajero
}