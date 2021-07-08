const sql = require('mssql')

var config = {
    user: 'INFINITO',
    password: 'Infinito1234',
    server: '212.83.166.109',
    database: 'BD_SRCOMANDA_ELSULTAN'
};
 

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a Azure SQL')
        return pool
    }).catch(err => console.log('Conexion Fallida', err))

module.exports = { sql, poolPromise}
