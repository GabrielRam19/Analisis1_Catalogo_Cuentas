const express = require('express');
const router = express.Router();
const asientosService = require('../services/AsientosService');

// Rutas para el CRUD de asientos
router.get('/asientos', asientosService.getAsientos);
router.post('/asientos', asientosService.createAsiento);
router.put('/asientos/:idAsiento', asientosService.updateAsiento);
router.delete('/asientos/:idAsiento', asientosService.deleteAsiento);

module.exports = router;