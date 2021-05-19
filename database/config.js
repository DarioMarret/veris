const oracledb = require('oracledb')
set = {
  user          : "HENRY.MATICURENA",
  password      : "henry123",  // mypw contains the hr schema password
  connectString : "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST =52.7.160.244)(PORT = 2112))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = PRODUCCION)))"
}

local = {
  user          : "system",
  password      : "marret",  // mypw contains the hr schema password
  connectString : "127.0.0.1/XE"
}



module.exports = {set,local}