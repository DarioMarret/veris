const jwt = require('jsonwebtoken');
const oracledb = require('oracledb')
const  set  = require('../database/config.js');
const empty = require('is-empty');


const TipoTransacio=(req,res)=>{
    jwt.verify(req.token, 'secretToken',(err, auth)=>{
        if(err){
            res.json({
                "code":401,
                "succes": false,
                "message":"error en la autenticacion del token",
                "errorData":err
            })
        }else{
            Transaciones(req,res,auth)
        }
    })
}

// http://localhost:3000/veris/transaciones
async function Transaciones (req,res) {
    const {codigoEmpresa, tipoPreTransaccion} = req.body;
    if(!empty(codigoEmpresa) && !empty(tipoPreTransaccion)){
        let conn
        try {
          conn = await oracledb.getConnection(set)
          const result = await conn.execute(`select * from latino_owner.fac_pre_transacciones where codigo_empresa = :e and tipo_pre_transaccion = :t`,
          {e: codigoEmpresa, t: tipoPreTransaccion});
          if(result.rows.length > 0){
            res.json({
              "code": 200,
              "success": true,
              "message": "resultado exitoso",
              "data": {
                  result,
              }
            })
          }else{
            res.json({
              "code": 401,
              "success": false,
              "message": "no se encontro resultado",
              "errorData": result.rows
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

module.exports={
    TipoTransacio,
}