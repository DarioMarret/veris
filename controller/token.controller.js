const jwt = require('jsonwebtoken')
const empty = require('is-empty');
//pasar por header aplication y IdOrganizacion
const GenerarNuevoToken=async(req,res)=>{
    const veris ={
        aplication:req.headers["aplication"],
        idorganizacion:req.headers["idorganizacion"]
    }

    if(!empty(veris.aplication)&& !empty(veris.idorganizacion)){
        try {
        const token = jwt.sign({veris}, 'secretToken',{expiresIn: 60 * 60})
        res.json({
            "code":res.statusCode,
            "token": token,
                "message":"use el token para transacionar"
            })
        } catch (error) {
            res.json({
                "code":401,
                "message":"Ha ocurrido un error inesperado.",
                "errorData":{
                    error
                }
            })
        }
    }else{
        res.json({
            "code":401,
            "succes": false,
            "message":"pasar por header aplication y IdOrganizacion.",
            "errorData":veris
        })
    }

}

function VerificarToken(req, res, next){
    const headerBearer = req.headers["authorization"];
    const aplication = req.headers["aplication"];
    const idorganizacion = req.headers["idorganizacion"];
    if(!empty(aplication)&&!empty(idorganizacion)){
        if(typeof headerBearer !== 'undefined'){
            const headerToken = headerBearer.split(" ")[1];
            req.token = headerToken;
            next()
        }else{
            res.json({
                "code": 401,
                "succes": false,
                message: typeof headerBearer === "undefined" ? "no envio el token":"toke incorrecto",
            });
        }
    }else{
        res.json({
            "code": 401,
            "success": false,
            "message": "Las cedenciales de autenticación no son válidas.",
          })
    }
}



module.exports ={
    GenerarNuevoToken,
    VerificarToken
}