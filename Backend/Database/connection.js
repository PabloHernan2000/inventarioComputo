const sql = require('mssql')

const sqlConfig = {
  user: 'pablo',
  password: '12345',
  database: 'Inventario_Computo',
  server: 'DESKTOP-7IP21Q3',
  options: {
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

const connection = async() => {
    try {
        const pool = await sql.connect(sqlConfig);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connection}; 