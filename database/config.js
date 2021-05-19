const oracledb = require('oracledb')
set = {
  user: "HENRY.MATICURENA",
  password: "henry123",
  connectString: "52.7.160.244:2112/produccion",
}
async function Conexion(){
  const connection = await oracledb.getConnection(
    {
      user          : "HENRY.MATICURENA",
      password      : "henry123",  // mypw contains the hr schema password
      connectString : "52.7.160.244:2112/produccion"
    }
  );
  return connection;
}
module.exports = {
  set,
  Conexion
}