const sql = require('mssql')

var config = {
    user: 'INFINITO',
    password: '@@Piero1207@@',
    server: 'infinitosoftware.database.windows.net',
    database: 'BD_SRCOMANDA_SHAWARMA',
    options: {
        encrypt: true,
    }
};
 

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a Azure SQL')
        return pool
    }).catch(err => console.log('Conexion Fallida', err))

module.exports = { sql, poolPromise}