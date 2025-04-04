const express = require('express');
const router = express.Router();
const jerarquiaService = require('../services/JerarquiaService');

// Rutas CRUD para jerarquía
router.get('/jerarquia', jerarquiaService.getJerarquia);
router.post('/jerarquia', jerarquiaService.createJerarquia);
router.put('/jerarquia/:id', jerarquiaService.updateJerarquia);
router.delete('/jerarquia/:id', jerarquiaService.deleteJerarquia);

module.exports = router;
