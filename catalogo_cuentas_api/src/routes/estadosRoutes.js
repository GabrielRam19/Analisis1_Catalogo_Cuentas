const express = require('express');
const router = express.Router();
const estadosFinancierosService = require('../services/EstadosService');

// Rutas CRUD para Estados Financieros
router.get('/estados-financieros', estadosFinancierosService.getEstadosFinancieros);
router.post('/estados-financieros', estadosFinancierosService.createEstadoFinanciero);
router.put('/estados-financieros/:id', estadosFinancierosService.updateEstadoFinanciero);
router.delete('/estados-financieros/:id', estadosFinancierosService.deleteEstadoFinanciero);

module.exports = router;
