const router = require('express').Router();

const { consultarUsuario } = require('../controller/usuario.controller.js');
const { VerificarToken } = require('../controller/token.controller.js');

router.post('/usuario_sistema',VerificarToken,consultarUsuario);

module.exports = router;