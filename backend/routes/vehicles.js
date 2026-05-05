const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/', vehicleController.registrarIngreso);
router.get('/', vehicleController.listarVehiculos);
router.put('/salida/:id', vehicleController.registrarSalida);

module.exports = router;
