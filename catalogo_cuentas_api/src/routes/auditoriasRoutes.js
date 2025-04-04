const express = require('express');
const router = express.Router();
const auditoriaService = require('../services/AuditoriasService');

// Rutas para el CRUD de auditoría
router.get('/auditorias', auditoriaService.getAuditorias);
router.post('/auditorias', auditoriaService.createAuditoria);
router.put('/auditorias/:id', auditoriaService.updateAuditoria);
router.delete('/auditorias/:id', auditoriaService.deleteAuditoria);

module.exports = router;