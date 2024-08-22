const express = require('express');
const router = express.Router();
const { decodeVehicleVin, addVehicle, getVehicleDetails} = require('../controller/vcontrol');

router.get('/decode/:vin', decodeVehicleVin);
router.post('/', addVehicle);
router.get('/:vin', getVehicleDetails);


module.exports = router;