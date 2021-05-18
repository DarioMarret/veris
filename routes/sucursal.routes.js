const router = require('express').Router();

const { sucursales } = require('../controller/sucursal.controller.js');
const { VerificarToken } = require('../controller/token.controller.js');

router.post('/lista_sucursal',VerificarToken,sucursales);

module.exports = router;