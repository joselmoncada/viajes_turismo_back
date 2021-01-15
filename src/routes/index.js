const { Router } = require('express');
const router = Router();


const { getAgencias, getAreaInteres, getAgenciasNoRelacionadasConAgencia, createAsociacion, finalizarAsociacion,getAsociaciones } = require('../controllers/index.controller');
const { getCiudades, getPaises, getAtracciones, getRegiones, createRegion, } = require('../controllers/regiones.controller');
const { getPaquetes, createPaquete, getAgenciaByName, deletePaquete, getPaqueteById } = require('../controllers/paquetes.controller');
const {getRallies, createRally } = require('../controllers/rallies.controller');
const { getHistoricoProveedor, getProveedoresNoRelacionadosConAgencia,
        createAsociacionConProveedor, updateAsocacionConProveedor 
    } = require('../controllers/proveedores.controller');
const {createViajero, deleteViajero, getViajeros, createPasaporte, 
        getPasaportesDeViajero, getPasaportesDeViajeroVigentes,
        deletePasaporte, registrarViajeroAAgencia, finalizarViajeroRelacionConAgencia,
        getViajero,getRegistroDeViajero
    } = require('../controllers/viajero.controller');
const {getClientes, getClienteByDOCorRIF, getClienteByID, crearClientePersona,  
    crearClienteJuridico, deleteCliente, registrarClienteAAgencia, 
    finalizarClienteRelacionConAgencia, getRegistroDeCliente, createInstrumentoPago, 
    addBanco, getBancos, getInstrumentosPorCliente, getInstrumentoPago, deleteInstrumentoPago
    } = require('../controllers/cliente.controller');


//EXAMPLE
router.get('/regiones', getRegiones);
router.post('/regiones', createRegion);


router.get('/agencias', getAgencias);
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
router.get('/viajeros',getViajeros)
router.get('/viajero/:documento?',getViajero)
router.post('/viajero',createViajero);
router.delete('/viajero/:documento?',deleteViajero)
    router.get('/pasaportes/:id_viajero?',getPasaportesDeViajero)
    router.get('/pasaportes-vigentes/:id_viajero?',getPasaportesDeViajeroVigentes)
    router.post('/pasaporte',createPasaporte)
    router.delete('/pasaporte/:id_viajero?/:id_pais?/:num_pasaporte?',deletePasaporte)
router.post('/registro-viajero',registrarViajeroAAgencia)
router.put('/registro-viajero/:id_agencia?/:id_viajero?/:fecha?',finalizarViajeroRelacionConAgencia)
router.get('/registro-viajero/:id_agencia?/:id_viajero?',getRegistroDeViajero)

//Clientes
router.get('/clientes',getClientes)
router.post('/cliente',getClienteByDOCorRIF)
router.get('/cliente/:id?',getClienteByID)
router.post('/cliente/persona',crearClientePersona)
router.post('/cliente/juridico',crearClienteJuridico)
router.delete('/cliente/:id?',deleteCliente)
    router.post('/registro-cliente',registrarClienteAAgencia)
    router.put('/registro-cliente/:id_agencia?/:id_cliente?/:fecha?',finalizarClienteRelacionConAgencia)
    router.get('/registro-cliente/:id_agencia?/:id_cliente?',getRegistroDeCliente)
router.post('/banco',addBanco)
router.get('/bancos',getBancos)
router.post('/instrumento',createInstrumentoPago)
router.get('/instrumentos/:id_cliente?',getInstrumentosPorCliente)
router.get('/instrumento/:id_cliente?/:id?',getInstrumentoPago)
router.delete('/instrumento/:id_cliente?/:id?',deleteInstrumentoPago)



//PAQUETES

router.get('/paquetes', getPaquetes);

router.get('/paquetes/:id?', getPaqueteById);

router.get('/agencia/:agencia?', getAgenciaByName); /*{
    try {
        console.log('PARAM: ' + request.query.agencia);
        const res = await getAgenciaByName(request.query.agencia);
        console.log('RESP: ' + res);
        response.json(res);
    } catch (error) {
        console.log(error);
    }

});*/

router.post('/paquetes', createPaquete);

router.delete('/paquetes/:id', deletePaquete);/* {
    try {
        const paquete = req.params.id;
        console.log('param: '+paquete);
        const response = await deletePaquete(paquete);
        //console.log(response);
        res.json(response);
    } catch (error) {
        return next(error);
    }
});*/

//RALLIES
router.get('/rallies', getRallies);
router.post('/rallies', createRally);


module.exports = router;