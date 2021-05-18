const router = require('express').Router();

const { GenerarNuevoToken } = require('../controller/token.controller.js');

router.get('/token',GenerarNuevoToken);

module.exports = router;