const { Router} =require('express');
const router = Router();


const { getRegiones, createRegion, getAgencias, getAreaInteres, getPaises } = require('../controllers/index.controller');


router.get('/regiones' , getRegiones);
router.post('/regiones', createRegion);
router.get('/agencias', getAgencias);
router.get('/areas_interes', getAreaInteres);
router.get('/paises', getPaises);

module.exports = router;