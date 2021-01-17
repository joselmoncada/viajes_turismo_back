const DB = require('../../DataBase');
pool = DB.getPool()

const getClientes = async (req,res,next)=>{ 
	try {
		const response = await pool.query(`select * from cjv_cliente`)
		res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const getClienteByDOCorRIF = async (req,res,next)=>{ 
	try {
		//se ejecuta por POST

		//se puede elegir en base a cual de las 3 variables buscar informacion (las 3 son unique)
		//el sql puede aceltar sin problemas no definir alguna de las variables en al consulta en si 
		const { documento, num_rif } = req.body
		console.log('get Cliente By ID or DOC or RIF: ', documento, num_rif )
		const response = await pool.query(`select * from cjv_cliente
											where documento = $1 or num_rif = $2)`, 
											[ documento, num_rif])
		
		res.send('mensaje enviado')
    } catch (e) {
        return next(e);
    }
}

const getClienteByID = async (req,res,next)=>{ 
	try {
		//se ejecuta por POST

		//se puede elegir en base a cual de las 3 variables buscar informacion (las 3 son unique)
		//el sql puede aceltar sin problemas no definir alguna de las variables en al consulta en si 
		const id = req.query.id
		console.log('get Cliente By ID:', id )
		const response = await pool.query(`select * from cjv_cliente where id = $1`, [id])
		
		res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}


const getClientesNoViajeros = async (req,res,next)=>{ 
	try {
		
		const response = await pool.query(`select documento, nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento  
											from cjv_cliente
											where documento is not null and documento not in(
												select documento 
												from cjv_viajero)`)
												console.log('clientes no viajeros',response.rows)
		res.status(200).json(response.rows)
    } catch (e) {
        return next(e);
    }
}

const crearClientePersona = async (req,res,next)=>{
	try {
        const {documento, nombre,fecha_nacimiento,segundo_nombre, primer_apellido, segundo_apellido} = req.body;
        console.log('crear Cliente Juridico: ', documento,nombre, fecha_nacimiento, segundo_nombre, primer_apellido, segundo_apellido);
        const response = await pool.query(`insert into cjv_cliente 
										(id, nombre, tipo_cliente, 
										documento, fecha_nacimiento,
										segundo_nombre, primer_apellido, 
										segundo_apellido)
										values( nextval('cjv_s_cliente'), 
										$1,'P', $2, $3, $4, $5, $6)`,
										[nombre, documento, fecha_nacimiento, segundo_nombre, 
										primer_apellido, segundo_apellido]);
        console.log(response);
        res.send('cliente creado con exito');
    } catch (e) {
        return next(e);
    }
}


const crearClienteJuridico = async (req,res,next)=>{
	try {
        const { nombre, num_rif } = req.body;
        console.log('crear Cliente Juridico: ', nombre, num_rif);
        const response = await pool.query(`insert into cjv_cliente 
											(id,nombre,tipo_cliente,num_rif)
											values(nextval('cjv_s_cliente'),$1,'J',$2)`,
            							[nombre,num_rif]);
        console.log(response);
        res.send('cliente creado con exito');
    } catch (e) {
        return next(e);
    }
}

const deleteCliente = async (req,res,next)=>{
	try {
		const id = req.query.id
		const response = pool.query(`delete from cjv_cliente
									where id = $1 and id not in ( 
									select id_cliente from cjv_registro_cliente 
									where id_cliente = $1 and fecha_fin is null);`,
									[id])
		res.send('cliente eliminado con exito');
	} catch (e) {
		return next(e);
	}
}

const registrarClienteAAgencia = async (req,res,next)=>{
	try {
		const id_agencia = req.body.id_agencia
		const id_cliente = req.body.id_cliente
		console.log('registrar Cliente A Agencia:', id_agencia, id_cliente)
		const response = pool.query(`insert into cjv_registro_cliente(id_agencia, id_cliente, fecha_inicio)
									values($1,$2,CURRENT_DATE)`,
									[id_agencia, id_cliente])
		res.send('cliente se registro a la agencia con exito');
	} catch (e) {
		return next(e);
	}
}

const finalizarClienteRelacionConAgencia = async (req,res,next)=>{
	try {
		const id_agencia = req.query.id_agencia
		const id_cliente = req.query.id_cliente
		const fecha = req.query.fecha
		console.log('finalizar Cliente Relacion Con Agencia:',id_agencia,id_cliente,fecha)
		const response = pool.query(`update cjv_registro_cliente
									set fecha_fin = CURRENT_DATE
									where id_agencia = $1 and id_cliente = $2 and fecha_inicio = $3`,
									[id_agencia, id_cliente, fecha])
		res.send('se finalizo el registro entre cliente y agencia con exito');
	} catch (e) {
		return next(e);
	}
}
const finalizarViajeroRelacionConAgenciaByIDViajero = async (req,res,next)=>{
    try{
        const id_viajero= req.query.id_viajero
        console.log('finalizar Relacion Con Agencia: ',req.query)

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


const getRegistroDeCliente = async (req,res,next)=>{
	try {
		const id_agencia = req.query.id_agencia
		const id_cliente = req.query.id_cliente
		console.log('get Registro De Cliente:',id_agencia, id_cliente)
		const response = pool.query(`select reg.id_agencia, agen.nombre as nombre_agencia, reg.id_cliente, 
									client.nombre as nombre_cliente, reg.fecha_inicio, fecha_fin 
									from cjv_registro_cliente as reg
 	 									left join cjv_agencia as agen   on id_agencia = agen.id
 										left join cjv_cliente as client on id_cliente = client.id
									WHERE fecha_fin is null and reg.id_agencia = $1 and reg.id_cliente = $2`,
									[id_agencia, id_cliente])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

const createInstrumentoPago = async (req,res,next)=>{
	try {
		const {id_cliente, clasificacion, id_banco, numero, email} = req.body
		console.log('create Instrumento Pago:',id_cliente, clasificacion, id_banco, numero, email)
		const response = await pool.query(`insert into cjv_instrumento_pago
									values($1,nextval('cjv_s_instrumento_pago'),$2,$3,$4,$5)`,
									[id_cliente, clasificacion, id_banco, numero, email])
		res.status(200).json(response)
	} catch (e) {
		return next(e);
	}
}

const addBanco = async(req,res,next) => {
	try {
		const nombre = req.body.nombre
		console.log('add Banco:', nombre)
		const response = await pool.query(`insert into cjv_banco values (nextval('cjv_s_banco'),$1)`,[nombre])
		res.status(200).json(response.rows)
		console.log(response.rows)
	} catch (e) {
		return next(e);
	}
}

const getBancos = async(req,res,next) => {
	try {
		console.log('get bancos')
		const response = await pool.query(`select * from cjv_banco`)
		res.status(200).json(response.rows)
		console.log(response.rows)
	} catch (e) {
		return next(e);
	}
}

const getInstrumentosPorCliente = async(req,res,next) => {
	try {
		const id_cliente = req.query.id_cliente
		console.log('get Instrumentos Por Cliente:',id_cliente)
		const response = await pool.query(`select id, clasificacion from cjv_instrumento_pago 
									where id_cliente = $1`,[id_cliente])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

const getInstrumentoPago = async(req,res,next) => {
	try {
		const id_cliente = req.query.id_cliente
		const id = req.query.id
		console.log('get Instrumento Pago:',id_cliente,id)
		const response = await pool.query(`select ins.id, ins.clasificacion, ins.id_banco, 
									b.nombre as nombre_banco, ins.numero, ins.email 
									from cjv_instrumento_pago as ins
										left join cjv_banco as b on ins.id_banco = b.id
									where ins.id_cliente = $1 and ins.id = $2`,[id_cliente,id])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}

const deleteInstrumentoPago = async(req,res,next) => {
	try {
		const id_cliente = req.query.id_cliente
		const id = req.query.id
		const response = await pool.query(`delete from cjv_instrumento_pago
									where id_cliente = $1 
										and id = $2 and id not in (
										select id_instrumento from cjv_forma_pago
										)
									`,[id_cliente,id])
		res.status(200).json(response.rows)
	} catch (e) {
		return next(e);
	}
}


module.exports = {
	getClientes,
	getClienteByDOCorRIF,
	getClientesNoViajeros,
	getClienteByID,
	crearClientePersona,
	crearClienteJuridico,
	deleteCliente,
	registrarClienteAAgencia,
	finalizarClienteRelacionConAgencia,
	finalizarViajeroRelacionConAgenciaByIDViajero,
	getRegistroDeCliente,
	createInstrumentoPago,
	addBanco,
	getBancos,
	getInstrumentosPorCliente,
	getInstrumentoPago,
	deleteInstrumentoPago,
}