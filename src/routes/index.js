const { Router } = require('express');
const router = Router();


const { getAgencias, getAreaInteres, getAgenciasNoRelacionadasConAgencia, createAsociacion, finalizarAsociacion,getAsociaciones } = require('../controllers/index.controller');
const { getCiudades, getPaises, getAtracciones, getRegiones, createRegion, } = require('../controllers/regiones.controller');
const { getPaquetes, createPaquete, getAgenciaByName, deletePaquete } = require('../controllers/paquetes.controller');
const {getRallies, createRally } = require('../controllers/rallies.controller');
const {getHistoricoProveedor, getProveedoresNoRelacionadosConAgencia,createAsociacionConProveedor, updateAsocacionConProveedor } = require('../controllers/proveedores.controller');
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

//PAQUETES

router.get('/paquetes', getPaquetes);
router.get('/agencia/', async function (request, response, next) {
    try {
        console.log('PARAM: ' + request.query.agencia);
        const res = await getAgenciaByName(request.query.agencia);
        console.log('RESP: ' + res);
        response.json(res);
    } catch (error) {
        console.log(error);
    }

});

router.post('/paquetes', createPaquete);

router.delete('/paquetes/:id', async function (req, res,next) {
    try {
        const paquete = req.params.id;
        console.log('param: '+paquete);
        const response = await deletePaquete(paquete);
        //console.log(response);
        res.json(response);
    } catch (error) {
        return next(error);
    }
});

//RALLIES
router.get('/rallies', getRallies);
router.post('/rallies', createRally);


module.exports = router;