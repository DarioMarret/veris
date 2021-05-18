const router = require('express').Router();

const { TipoTransacio } = require('../controller/transacion.controller.js');
const { VerificarToken } = require('../controller/token.controller.js');

router.post('/transaciones',VerificarToken,TipoTransacio);

module.exports = router;