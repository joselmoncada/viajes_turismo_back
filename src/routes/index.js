const { Router} =require('express');
const router = Router();


const { getRegiones } = require('../controllers/index.controller');


router.get('/regiones' , getRegiones);

module.exports = router;