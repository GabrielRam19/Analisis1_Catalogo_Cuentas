const express = require('express');
const router = express.Router();
const gruposService = require('../services/GruposService');

// Rutas CRUD para grupos
router.get('/grupos', gruposService.getGrupos);
router.post('/grupos', gruposService.createGrupo);
router.put('/grupos/:id', gruposService.updateGrupo);
router.delete('/grupos/:id', gruposService.deleteGrupo);

module.exports = router;
