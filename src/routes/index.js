const { Router} =require('express');
const router = Router();


const { getRegiones, createRegion } = require('../controllers/index.controller');


router.get('/regiones' , getRegiones);
router.post('/regiones', createRegion);

module.exports = router;