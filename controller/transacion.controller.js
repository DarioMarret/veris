const jwt = require('jsonwebtoken');
const oracledb = require('oracledb')
const  {set,Conexion}  = require('../database/config.js');
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
  const codigoEmpresa = req.query.codigoEmpresa;
  const tipoPreTransaccion = req.query.tipoPreTransaccion;
  if(!empty(codigoEmpresa) && !empty(tipoPreTransaccion)){
    if(tipoPreTransaccion === "COTIZACION" || tipoPreTransaccion === "FACTURA"){
      const { secuenciaUsuario, idTurno, caja,nemonicoCanalFacturacion} = req.body;
      if(!empty(secuenciaUsuario) && !empty(caja) && !empty(nemonicoCanalFacturacion) && idTurno === null){
        if (nemonicoCanalFacturacion === "CAJA"){
          const codigo_canal_facturacion = nemonicoCanalFacturacion == "CAJA" ? 1 : 0;
          const {codigoSucursal,codigoCaja,numeroPuntoEmision } = caja;
          let conn
          try {
            conn = await oracledb.getConnection(set)
            const result = await conn.execute(`select secuencia_usuario,codigo_empresa,codigo_usuario,es_activo,secuencia_usuario_ingreso,usuario_ingreso from latino_owner.dafx_usuarios_sistema where codigo_empresa = :e and secuencia_usuario = :t`,{e: codigoEmpresa, t: secuenciaUsuario});
            const secuencia_usuario = result.rows[0][0]
            const codigo_empresa =result.rows[0][1]
            const codigo_usuario = result.rows[0][2]
            const es_activo = result.rows[0][3]
            const secuencia_usuario_ingreso = result.rows[0][4]
            const usuario_ingreso = result.rows[0][5]

            if(result.rows.length > 0){
              const codigotransaccion = await conn.execute(`select max(codigo_pre_transaccion) from latino_owner.fac_pre_transacciones`);
              const codigo_pre_transaccion = codigotransaccion.rows[0][0] +1;
  
              const fecha = new Date();
              let mes_actual = fecha.getMonth() + 1;
              let dia_actual = fecha.getDate();
              let anio_actual = fecha.getFullYear()
              let fecha_ingreso = dia_actual+"/0"+mes_actual+"/"+anio_actual;
              console.log(codigo_pre_transaccion,codigo_empresa,codigoSucursal,codigoCaja,numeroPuntoEmision,secuencia_usuario,codigo_usuario,tipoPreTransaccion,codigo_canal_facturacion,es_activo,secuencia_usuario_ingreso,usuario_ingreso,fecha_ingreso);
  
              const transacion = await conn.execute(`insert into latino_owner.fac_pre_transacciones (codigo_pre_transaccion,codigo_empresa,codigo_sucursal,codigo_caja,numero_punto_emision,secuencia_usuario,codigo_usuario,tipo_pre_transaccion,codigo_canal_facturacion,es_activo,secuencia_usuario_ingreso,usuario_ingreso,fecha_ingreso)values(:codigo_pre_transaccion, :codigo_empresa, :codigo_sucursal, :codigo_cajan, :numero_punto_emision, :secuencia_usuario, :codigo_usuario, :tipo_pre_transaccion, :codigo_canal_facturacion, :es_activo, :secuencia_usuario_ingreso, :usuario_ingreso, :fecha_ingreso)`,
              {codigo_pre_transaccion: codigo_pre_transaccion, codigo_empresa: codigo_empresa, codigoSucursal: codigoSucursal, codigoCaja: codigoCaja, numeroPuntoEmision: numeroPuntoEmision, secuencia_usuario: secuencia_usuario, codigo_usuario: codigo_usuario, tipoPreTransaccion: tipoPreTransaccion, codigo_canal_facturacion: codigo_canal_facturacion, es_activo: es_activo, secuencia_usuario_ingreso: secuencia_usuario_ingreso, usuario_ingreso: usuario_ingreso, fecha_ingreso: fecha_ingreso});
  
              console.log(transacion);
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
            "message": "codigo de canal no permitido",
            "errorData": []
          })
        }

      }else{
        res.json({
          "code": 400,
          "success": false,
          "message": "valtan valores en el body",
          "errorData": []
        })
      }
    }else{
      res.json({
        "code": 400,
        "success": false,
        "message": "valores de transacion no permitido",
        "errorData": []
      })
    
    }
      
    }else{
        res.json({
            "code": 400,
            "success": false,
            "message": "envio valores vacio query",
            "errorData": []
          })
    }
  }

module.exports={
    TipoTransacio,
}