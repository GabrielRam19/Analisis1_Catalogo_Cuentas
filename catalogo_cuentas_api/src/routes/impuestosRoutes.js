const express = require('express');
const router = express.Router();
const impuestosService = require('../services/ImpuestosService');

// Rutas CRUD para Impuestos
router.get('/impuestos', impuestosService.getImpuestos);
router.post('/impuestos', impuestosService.createImpuesto);
router.put('/impuestos/:id', impuestosService.updateImpuesto);
router.delete('/impuestos/:id', impuestosService.deleteImpuesto);

module.exports = router;
