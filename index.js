const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const RouterToken = require('./routes/token.routes.js');
const RouterTransa = require('./routes/transacion.routes.js');
const RouterUsuario = require('./routes/usuario.routes.js');
const RouterSucursal = require('./routes/sucursal.routes.js');
const RouterEmpresa = require('./routes/empresa.routes.js');

const app = express();
// midd
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//rutas
app.use("/generar",RouterToken);
app.use("/veris",RouterTransa);
app.use("/usuario",RouterUsuario);
app.use("/sucursal",RouterSucursal);
app.use("/empresa",RouterEmpresa);

app.listen(3000,()=>{
    console.log("Escuchando en http://localhost:3000")
});