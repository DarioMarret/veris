const router = require('express').Router();

const { empresa } = require('../controller/empresa.controller.js');
const { VerificarToken } = require('../controller/token.controller.js');

router.post('/principal',VerificarToken,empresa);

module.exports = router;