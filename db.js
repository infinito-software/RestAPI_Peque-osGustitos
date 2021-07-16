const sql = require('mssql')

var config = {
    user: 'sa',
    password: '@@Infinito1234',
    server: '212.83.166.109',
    database: 'BD_SRGOURMET_LAGRANJA_YAVARI'
};
 

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a Azure SQL')
        return pool
    }).catch(err => console.log('Conexion Fallida', err))

module.exports = { sql, poolPromise}
