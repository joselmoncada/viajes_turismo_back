const { Router } = require('express');
const router = Router();


const { getAgencias, getAreaInteres, getAgenciasNoRelacionadasConAgencia, createAsociacion, finalizarAsociacion,getAsociaciones } = require('../controllers/index.controller');
const { getCiudades, getPaises, getAtracciones, getRegiones, createRegion, } = require('../controllers/regiones.controller');
const { getPaquetes, createPaquete, getAgenciaByName, deletePaquete, getPaqueteById, getPrecioPaquete } = require('../controllers/paquetes.controller');
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
//router.get('/regiones', getRegiones);
//router.post('/regiones', createRegion);

//AGENCIAS
router.get('/agencias', getAgencias);
router.get('/agencia/:agencia?', getAgenciaByName); 


//PAISES, CIUDADES, ATRACCIONES,INTERESES
router.get('/areas_interes', getAreaInteres);
router.get('/paises', getPaises);
router.get('/ciudades', getCiudades);
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


router.post('/paquetes', createPaquete);

router.delete('/paquetes/:id', deletePaquete);

router.get('/paquete-costo/:id_agencia?/:id_paquete?', getPrecioPaquete)

//RALLIES
router.get('/rallies', getRallies);
router.post('/rallies', createRally);


module.exports = router;