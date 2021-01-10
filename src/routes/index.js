const { Router} =require('express');
const router = Router();


const {  getAgencias, getAreaInteres,  } = require('../controllers/index.controller');
const {getCiudades,getPaises ,getAtracciones,getRegiones, createRegion,} = require('../controllers/regiones.controller');
const {getPaquetes, createPaquete, getAgenciaByName} = require('../controllers/paquetes.controller');
//EXAMPLE
router.get('/regiones' , getRegiones);
router.post('/regiones', createRegion);


router.get('/agencias', getAgencias);
router.get('/areas_interes', getAreaInteres);
router.get('/paises', getPaises);
router.get('/ciudades', getCiudades);
router.get('/atracciones', getAtracciones);

//PAQUETES


router.get('/paquetes' , getPaquetes);
router.get('/agencia/' , async function(request, response, next){
    try {
        console.log('PARAM: '+ request.query.agencia);
        const res = await getAgenciaByName(request.query.agencia);
        console.log('RESP: '+ res);
        response.json(res);
    } catch (error) {
        return next(error);
    }
 
} );

router.post('/paquetes', createPaquete);

module.exports = router;