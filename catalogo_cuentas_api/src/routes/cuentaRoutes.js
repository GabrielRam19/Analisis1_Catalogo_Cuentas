const express = require('express');
const router = express.Router();
const cuentaService = require('../services/CuentasService');

// Rutas para el CRUD de cuentas
router.get('/cuentas', cuentaService.getCuentas);
router.post('/cuentas', cuentaService.createCuenta);
router.put('/cuentas/:codigo', cuentaService.updateCuenta);
router.delete('/cuentas/:codigo', cuentaService.deleteCuenta);

module.exports = router;
