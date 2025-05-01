const express = require('express');
const router = express.Router();
const libroMayorService = require('../services/LibroMayorService');

// Rutas para el libro mayor
router.get('/libro-mayor', libroMayorService.getLibroMayor);

module.exports = router;