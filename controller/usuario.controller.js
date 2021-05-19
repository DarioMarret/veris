const jwt = require('jsonwebtoken');
const oracledb = require('oracledb')
const  set  = require('../database/config.js');
const empty = require('is-empty');

//http://localhost:3000/usuario/usuario_sistema
const consultarUsuario=(req,res)=>{
    jwt.verify(req.token, 'secretToken',(err, auth)=>{
        if(err){
            res.json({
                "code":401,
                "succes": false,
                "message":"error en la autenticacion del token",
                "errorData":err
            })
        }else{
            Usuario(req,res)
        }
    })
}
//http://localhost:3000/usuario/usuario_sistema
async function Usuario(req,res){
  console.log(req)
    const {codigoEmpresa, secuenciaUsuario} = req.body;
    if(!empty(codigoEmpresa) && !empty(secuenciaUsuario)){
        let conn
        try {
          conn = await oracledb.getConnection(set)
          const result = await conn.execute(`select SECUENCIA_USUARIO,CODIGO_EMPRESA,CODIGO_USUARIO,ES_ACTIVO,SECUENCIA_USUARIO_INGRESO,USUARIO_INGRESO from latino_owner.dafx_usuarios_sistema where codigo_empresa = :c and secuencia_usuario = :s`,
          {c: codigoEmpresa, s: secuenciaUsuario});
          if(result.rows.length > 0){
            const codigo_pre_transaccion =await conn.execule(`select max(codigo_pre_transaccion) from latino_owner.fac_pre_transacciones`);
              console.log(codigo_pre_transaccion[0][0]);  
            res.json({
                "code": 0,
                "success": true,
                "message": "string",
                "data": result.rows
              })
          }else{
            res.json({
                "code": 401,
                "success": false,
                "message": "no se encontro resultado",
              }) 
          }
        } catch (err) {
          res.json({
            "code": 500,
            "success": false,
            "message": "Ha ocurrido un error inesperado.",
            "errorData": err
          })
        } finally {
          if (conn) { 
            await conn.close()
          }
        }
    }else{
        res.json({
            "code": 400,
            "success": false,
            "message": "envio valores vacio",
            "errorData": []
          })
    }
}


module.exports = {
    consultarUsuario
}