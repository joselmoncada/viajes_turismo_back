const { Router } = require('express');
const router = Router();


const { getAgencias, getAreaInteres, getAgenciasNoRelacionadasConAgencia, createAsociacion, finalizarAsociacion,getAsociaciones, getAreaInteresByAgenciaID, getAreaInteresByPaquetePK } = require('../controllers/index.controller');
const { getCiudades, getPaises, getAtracciones, getRegiones, createRegion, getCiudadesByPais, } = require('../controllers/regiones.controller');

const { getPaquetes, createPaquete, getAgenciaByName, 
    deletePaquete, getPaqueteById,getPaqueteByPk,
    createPrecio, updatePrecio, getPrecioByPk,  
    getHistoricoPreciosByPk, getPaquetesDisponibles,
    getCalendarioDisponible, getHistoricoCalendario, 
    createDateCalendario, getLugaresHoteltes,
    getServiciosPaquete, createServicioPaquete,
    deleteServicio,
    createElementoItinerario, getPaqueteEspecializaciones,
    getItinerarioByPaquete,updateDuracionPaquete, createEspecializacion
    } = require('../controllers/paquetes.controller');

const {getRallies, createRally } = require('../controllers/rallies.controller');
const { getHistoricoProveedor, getProveedoresNoRelacionadosConAgencia,
        createAsociacionConProveedor, updateAsocacionConProveedor 
    } = require('../controllers/proveedores.controller');
const {createViajero, deleteViajero, getViajeros, getViajerosNoClientes, createPasaporte, 
        getPasaportesDeViajero, getPasaportesDeViajeroVigentes,
        deletePasaporte, registrarViajeroAAgencia, finalizarViajeroRelacionConAgencia,
        finalizarViajeroRelacionConAgenciasByIDViajero,
        getViajero,  getRegistroViajeroVigente, getTodosRegistrosViajero,
        getViajeroAgenciasAsociables,cantidadViajesIncluidoViajero
    } = require('../controllers/viajero.controller');
const {getClientes, getClienteByDOCorRIF, getClientesNoViajeros, getClienteByID, crearClientePersona,  
    crearClienteJuridico, deleteCliente, registrarClienteAAgencia,finalizarClienteRelacionConAgencia,		
    finalizarClienteRelacionConAgenciasByIDCliente, getTodosRegistrosCliente, getRegistroDeClienteVigente, createInstrumentoPago, 
    addBanco, getBancos, getInstrumentosPorCliente, getInstrumentoPago, deleteInstrumentoPago, 
    getClienteAgenciasAsociables,cantidadContratosIncluidoCliente
    } = require('../controllers/cliente.controller');


//EXAMPLE
router.get('/regiones', getRegiones);
router.post('/regiones', createRegion);


router.get('/agencias', getAgencias);
router.get('/areas_interes/agencia/:id_agencia?',getAreaInteresByAgenciaID)
router.get('/areas_interes/paquete/:id_agencia?/:id_paquete?',getAreaInteresByPaquetePK)
router.get('/areas_interes', getAreaInteres);
router.get('/paises', getPaises);
router.get('/ciudades', getCiudades);
router.post('/ciudades-de-pais',getCiudadesByPais)
router.get('/atracciones', getAtracciones);

//asocaciones
router.get('/asociaciones', getAsociaciones);
router.get('/asociacion/:id?', getAgenciasNoRelacionadasConAgencia);
router.post('/asociacion', createAsociacion);
router.put('/asociacion/:id1?/:id2?/:fecha?', finalizarAsociacion);

//asociaciones-Proveedores
router.get('/asociacion-proveedores', getHistoricoProveedor);
router.get('/asociacion-proveedor/:id?', getProveedoresNoRelacionadosConAgencia);
router.post('/asociacion-proveedor', createAsociacionConProveedor);
router.put('/asociacion-proveedor/:id_agencia?/:id_proveedor?/:fecha?', updateAsocacionConProveedor);

//Viajeros    
router.get('/viajeros/no-clientes',getViajerosNoClientes)
router.get('/viajeros',getViajeros)
router.get('/viajero/viajes/:documento?',cantidadViajesIncluidoViajero)
router.get('/viajero/:documento?',getViajero)
router.post('/viajero',createViajero);
router.delete('/viajero/:documento?',deleteViajero)
    router.get('/pasaportes/:id_viajero?',getPasaportesDeViajero)
    router.get('/pasaportes-vigentes/:id_viajero?',getPasaportesDeViajeroVigentes)
    router.post('/pasaporte',createPasaporte)
    router.delete('/pasaporte/:id_viajero?/:id_pais?/:num_pasaporte?',deletePasaporte)
router.get('/registro-viajero-vigente/:id_viajero?',getRegistroViajeroVigente)
router.get('/registro-viajero/agencias-disponibles/:id_viajero?',getViajeroAgenciasAsociables)
router.get('/registro-viajero/:id_viajero?',getTodosRegistrosViajero)
router.post('/registro-viajero',registrarViajeroAAgencia)
router.put('/registro-viajero/byid/:id_viajero?',finalizarViajeroRelacionConAgenciasByIDViajero)
router.put('/registro-viajero/:id_agencia?/:id_viajero?/:fecha?',finalizarViajeroRelacionConAgencia)



//Clientes
router.get('/clientes/no-viajeros',getClientesNoViajeros);
router.get('/cliente/contratos/:id_cliente?',cantidadContratosIncluidoCliente)
router.get('/clientes',getClientes);
router.post('/cliente',getClienteByDOCorRIF);
router.get('/cliente/:id?',getClienteByID);
router.post('/cliente/persona',crearClientePersona);
router.post('/cliente/juridico',crearClienteJuridico);
router.delete('/cliente/:id?',deleteCliente);
    router.get('/registro-cliente-vigente/:id_cliente?',getRegistroDeClienteVigente)
    router.get('/registro-cliente/agencias-disponibles/:id_cliente?',getClienteAgenciasAsociables)
    router.get('/registro-cliente/:id_cliente?',getTodosRegistrosCliente)
    router.post('/registro-cliente',registrarClienteAAgencia)
    router.put('/registro-cliente/byid/:id_cliente?',finalizarClienteRelacionConAgenciasByIDCliente)
    router.put('/registro-cliente/:id_agencia?/:id_cliente?/:fecha?',finalizarClienteRelacionConAgencia)
router.post('/banco',addBanco);
router.get('/bancos',getBancos);
    router.get('/instrumentos/:id_cliente?',getInstrumentosPorCliente);
    router.post('/instrumento',createInstrumentoPago);
    router.get('/instrumento/:id_cliente?/:id?',getInstrumentoPago);
    router.delete('/instrumento/:id_cliente?/:id?',deleteInstrumentoPago);
    


//PAQUETES
router.get('/paquetes', getPaquetes);
router.get('/paquetes/:id?', getPaqueteById);
router.get('/paquete/:id_agencia?/:id?', getPaqueteByPk);
router.get('/paquetes-diponibles', getPaquetesDisponibles) // te da todos los paquetes disponibles,. no tiene filtro de agencia u otros
router.post('/paquete', createPaquete);
router.put('/paquete/duracion',updateDuracionPaquete)
router.delete('/paquete',deletePaquete)
//PAQUETES - PRECIO
router.post('/paquete/precio',createPrecio)
router.put('/paquete/precio', updatePrecio)
router.post('/paquete/precio/bypk',getPrecioByPk)
router.post('/paquete/precios/historico',getHistoricoPreciosByPk)

//PAQUETES - CALENDARIO
router.post('/paquete/calendario', getCalendarioDisponible)
router.post('/paquete/calendario/historico', getHistoricoCalendario)
router.post('/paquete/fecha', createDateCalendario)

//PAQUETES - SERVICIOS
router.post('/paquete/servicios',getServiciosPaquete)
router.post('/paquete/servicio/crear',createServicioPaquete)
router.delete('/paquete/servicio',deleteServicio)
router.post('/paquete/hoteles',getLugaresHoteltes)

//PAQUETES - ITINERARIO
router.post('/paquete/itinerario', getItinerarioByPaquete)
router.post('/paquete/itinerario/elemento/crear', createElementoItinerario)



//PAQUETE - Especializacion
router.post('/paquete/especializaciones', getPaqueteEspecializaciones)
router.post('/paquete/especializacion/crear', createEspecializacion)


router.get('/agencia/:agencia?', getAgenciaByName); 


//RALLIES
router.get('/rallies', getRallies);
router.post('/rallies', createRally);


module.exports = router;