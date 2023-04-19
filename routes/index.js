var API_KEY = "1234";
var SECRET_KEY = "INFINITOSOFTWARE_IquitosDelivery_Key_jsdksdkriewr";

var express = require('express')
var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload = multer({ storage: storage });
const cloudinary = require('cloudinary').v2


var jwt = require('jsonwebtoken');
var exjwt = require('express-jwt');
const { poolPromise, sql } = require('../db')

/*
 * DECLARAR CLAVE SECRETA
 * */
const jwtMW = exjwt({
    secret: SECRET_KEY
});

//+++++//TEST API//+++++/// - INFINITO SOFTWARE
router.get('/', function (req, res) {
    res.end("API CORRIENDO");
});

//+++++//TEST API CON JWT//+++++/// - INFINITO SOFTWARE
router.get('/testjwt', jwtMW, function (req, res) {
    var authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch (e) {
        return res.status(401).send('Unauthorized');
    }

    var fbid = decoded.fbid;
    res.send(JSON.stringify({ success: true, message: "FBID: " + fbid }));
});

//=========================================================================
// REQUEST JWT WITH FIREBASE ID
//=========================================================================

router.get('/getKey', async (req, res, next) => {
    var fbid = req.query.fbid;
    if (fbid != null) {
        let token = jwt.sign({ fbid: fbid }, SECRET_KEY, {});
        res.send(JSON.stringify({ success: true, token: token }));
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing fbid in request" }));
    }
});

//=========================================================================
// ActualizarStatusCodeCPE
//=========================================================================

router.put('/ActualizarStatusCodeCPE', jwtMW, async (req, res, next) => {

    var IdSalida = req.body.IdSalida;
    var CodigoEstadoCDR = req.body.CodigoEstadoCDR;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdSalida', sql.Int, IdSalida)
            .input('CodigoEstadoCDR', sql.NVarChar, CodigoEstadoCDR)
            .input('Opcion', sql.TinyInt, opcion)
            .output('Rpta')
            .execute('ActualizarStatusCodeCPE')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// ConfiguracionEmpresa
//=========================================================================

router.get('/ConfiguracionEmpresa', jwtMW, async (req, res, next) => {

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .execute('ConfiguracionEmpresa')

        if (queryResult.recordset.length > 0) {
            res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: "Empty" }));
        }
    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

});

//=========================================================================
// TABLA USUARIO
// GET
//=========================================================================

router.get('/Pa_MB_Usuario', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    var IdLocal = req.query.IdLocal;
    if (Opcion != null && IdLocal != null ) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('IdLocal', sql.Int, IdLocal)
                .execute('Pa_MB_Usuario')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA MOZOS
// POST / GET
//=========================================================================

router.get('/Pa_MB_Agentes_Listas', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    var idAgBus = req.query.idAgBus;
    if (Opcion != null && idAgBus != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('idAgBus', sql.Int, idAgBus)
                .execute('Pa_MB_Agentes_Listas')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA CORRELATIVOS
// POST / GET
//=========================================================================

router.get('/Pa_MB_SerieCorrelativo', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_SerieCorrelativo')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.put('/Pa_AEE_SerieCorrelativo', jwtMW, async (req, res, next) => {



    var IdSerieCorrelativo = req.body.IdSerieCorrelativo;
    var Serie = req.body.Serie;
    var Correlativo = req.body.Correlativo;
    var PuntoVenta = req.body.PuntoVenta;
    var ParaFE = req.body.ParaFE;
    var IdLocal = req.body.IdLocal;
    var IdTipCompPago = req.body.IdTipCompPago;
    var ModeloCPE = req.body.ModeloCPE;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdSerieCorrelativo', sql.Int, IdSerieCorrelativo)
            .input('Serie', sql.VarChar, Serie)
            .input('Correlativo', sql.VarChar, Correlativo)
            .input('PuntoVenta', sql.VarChar, PuntoVenta)
            .input('ParaFE', sql.Char, ParaFE)
            .input('IdLocal', sql.Int, IdLocal)
            .input('IdCompPago', sql.Int, IdTipCompPago)
            .input('ModeloCPE', sql.VarChar, ModeloCPE)
            .input('IdCaja', sql.Int, 0)
            .input('AnchoPapel', sql.Int, 0)
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_SerieCorrelativo')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})


//=========================================================================
// TABLA LOCALES
// POST / GET
//=========================================================================

router.get('/Pa_MB_Local', jwtMW, async (req, res, next) => {

    var IdLocal = req.query.IdLocal;
    var userAdmin = req.query.userAdmin;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdLocalGlobal', sql.Int, IdLocal)
                .input('UserAdministrador', sql.Int, userAdmin)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Local')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA ALMACENES
// POST / GET
//=========================================================================

router.get('/Pa_MB_Almacen', jwtMW, async (req, res, next) => {

    var idAlmacen = req.query.idAlmacen;
    var userAdmin = req.query.userAdmin;
    var IdLocal = req.query.IdLocal;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdAlmacenGlobal', sql.Int, idAlmacen)
                .input('UserAdministrador', sql.Int, userAdmin)
                .input('IdLocal', sql.Int, IdLocal)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Almacen')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// AUTENTICAR USUARIO
// POST / GET
//=========================================================================

router.get('/Pa_Auntenticar_Usuario', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    var Iniciales = req.query.Iniciales;
    var Contraseña = req.query.Contraseña;
    if (Iniciales != null && Contraseña != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Iniciales', sql.VarChar, Iniciales)
                .input('contraseña', sql.VarChar, Contraseña)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_Auntenticar_Usuario')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA TURNO APERTURA
// POST / GET
//=========================================================================

router.get('/Pa_MB_TurnoApertura', jwtMW, async (req, res, next) => {

    var Busqueda = req.query.Busqueda;
    var Opcion = req.query.Opcion;
    if (Busqueda != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Busqueda', sql.VarChar, Busqueda)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_TurnoApertura')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_Turno', jwtMW, async (req, res, next) => {

    var Busqueda = req.query.Busqueda;
    var Opcion = req.query.Opcion;
    if (Busqueda != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Busqueda', sql.VarChar, Busqueda)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Turno')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});


router.post('/Pa_AEE_TurnoApertura', jwtMW, async (req, res, next) => {

    var idTurnoApertura = req.body.idTurnoApertura;
    var idTurno = req.body.idTurno;
    var idAgente = req.body.idAgente;
    var MontoInicial = req.body.MontoInicial;
    var FechaInicio = req.body.FechaInicio;
    var HoraInicio = req.body.HoraInicio;
    var FechaFinal = req.body.FechaFinal;
    var HoraFinal = req.body.HoraFinal;
    var IdLocal = req.body.IdLocal;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idTurnoA', sql.Int, idTurnoApertura)
            .input('idTurno', sql.Int, idTurno)
            .input('idAgente', sql.Int, idAgente)
            .input('MontoInicio', sql.Decimal, MontoInicial)
            .input('FechaInicio', sql.Date, FechaInicio)
            .input('HoraInicio', sql.NVarChar, HoraInicio)
            .input('FechaFinal', sql.Date, FechaFinal)
            .input('HoraFinal', sql.NVarChar, HoraFinal)
            .input('IdLocal', sql.Int, IdLocal)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_TurnoApertura')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.put('/Pa_AEE_TurnoApertura', jwtMW, async (req, res, next) => {

    var idTurnoApertura = req.body.idTurnoApertura;
    var idTurno = req.body.idTurno;
    var idAgente = req.body.idAgente;
    var MontoInicial = req.body.MontoInicial;
    var FechaInicio = req.body.FechaInicio;
    var HoraInicio = req.body.HoraInicio;
    var FechaFinal = req.body.FechaFinal;
    var HoraFinal = req.body.HoraFinal;
    var IdLocal = req.body.IdLocal;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idTurnoA', sql.Int, idTurnoApertura)
            .input('idTurno', sql.Int, idTurno)
            .input('idAgente', sql.Int, idAgente)
            .input('MontoInicio', sql.Decimal, MontoInicial)
            .input('FechaInicio', sql.Date, FechaInicio)
            .input('HoraInicio', sql.NVarChar, HoraInicio)
            .input('FechaFinal', sql.Date, FechaFinal)
            .input('HoraFinal', sql.NVarChar, HoraFinal)
            .input('IdLocal', sql.Int, IdLocal)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_TurnoApertura')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA FORMA PAGO
// POST / GET
//=========================================================================
router.get('/Pa_MB_FormaPago', jwtMW, async (req, res, next) => {

    var opcion = req.query.opcion;
    if (opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('opcion', sql.Int, opcion)
                .execute('Pa_MB_FormaPago')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});


//=========================================================================
// TABLA OPERACIONES
// POST / GET
//=========================================================================
router.get('/Pa_MB_Operacion', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Operacion')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA SALONES
// POST / GET
//=========================================================================

router.get('/Pa_MB_Salon', jwtMW, async (req, res, next) => {

    var IdLocal = req.query.IdLocal;
    var Opcion = req.query.Opcion;
    if (IdLocal != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdLocal', sql.Int, IdLocal)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Salon')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA MESAS
// POST / GET
//=========================================================================

router.get('/Pa_MB_Mesa_Tactil', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    var Busqueda = req.query.Busqueda;
    var idSalon = req.query.idSalon;
    var idMesa = req.query.idMesa;
    if (idSalon != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('Busqueda', sql.VarChar, Busqueda)
                .input('idSalon', sql.Int, idSalon)
                .input('idMesa', sql.Int, idMesa)
                .execute('Pa_MB_Mesa_Tactil')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA EMPRESA
// POST / GET
//=========================================================================

router.get('/Pa_MB_Empresa', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;

    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Empresa')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA FAMILIAS
// POST / GET
//=========================================================================

router.get('/Pa_MB_Familia_Lista', jwtMW, async (req, res, next) => {

    var idFamBusqueda = req.query.idFamBusqueda;
    var idSalon = req.query.idSalon;
    var Opcion = req.query.Opcion;
    if (idSalon != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idFamBusqueda', sql.Int, idFamBusqueda)
                .input('idSalon', sql.Int, idSalon)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Familia_Lista')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA STOCK
// POST / GET
//=========================================================================

router.get('/Pa_MB_Stock_Listas', jwtMW, async (req, res, next) => {
    var idFamilia = req.query.idFamilia;
    var opcion = req.query.opcion;
    var IdAlmacen = req.query.IdAlmacen;
    var IdLocal = req.query.IdLocal;
    if (IdLocal != null && opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idFamilia', sql.Int, idFamilia)
                .input('IdAlmacen', sql.Int, IdAlmacen)
                .input('IdLocal', sql.Int, IdLocal)
                .input('Opcion', sql.Int, opcion)
                .execute('Pa_MB_Stock_Listas')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

})

router.get('/Pa_MB_Stock', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    var IdAlmacen = req.query.IdAlmacen;
    var IdLocal = req.query.IdLocal;
    if (IdLocal != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('IdAlmacen', sql.Int, IdAlmacen)
                .input('IdLocal', sql.Int, IdLocal)
                .execute('Pa_MB_Stock')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_Stock_Filtro', jwtMW, async (req, res, next) => {

    var Texto = req.query.Texto;
    var Opcion = req.query.Opcion;
    var IdAlmacen = req.query.IdAlmacen;
    var IdLocal = req.query.IdLocal;
    if (IdLocal != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Texto', sql.VarChar, Texto)
                .input('Opcion', sql.Int, Opcion)
                .input('IdAlmacen', sql.Int, IdAlmacen)
                .input('IdLocal', sql.Int, IdLocal)
                .execute('Pa_MB_Stock_Filtro')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.post('/Pa_AEE_Stock', jwtMW, async (req, res, next) => {


    var idStock = req.body.idStock;
    var IdProducto = req.body.IdProducto;
    var StockInicial = req.body.StockInicial;
    var StockP = req.body.StockP;
    var idAlmacen = req.body.idAlmacen;
    var idUnidadMedida = req.body.idUnidadMedida;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdStock', sql.Int, idStock)
            .input('IdProducto', sql.Int, IdProducto)
            .input('StockInicial', sql.Decimal, StockInicial)
            .input('stock', sql.Decimal, StockP)
            .input('IdAlmacen', sql.Int, idAlmacen)
            .input('idUnidadMedida', sql.Int, idUnidadMedida)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_Stock')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA PRESENTACION PRODUCTO
// POST / GET
//=========================================================================

router.get('/Pa_MB_PresentacionProd_Filtro', jwtMW, async (req, res, next) => {
    var idBusqueda = req.query.idBusqueda;
    var Busqueda = req.query.Busqueda;
    var Opcion = req.query.Opcion;
    var IdAlmacen = req.query.IdAlmacen;
    var IdLocal = req.query.IdLocal;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idBusqueda', sql.Int, idBusqueda)
                .input('Busqueda', sql.VarChar, Busqueda)
                .input('Opcion', sql.Int, Opcion)
                .input('IdAlmacen', sql.Int, IdAlmacen)
                .input('IdLocal', sql.Int, IdLocal)
                .execute('Pa_MB_PresentacionProd_Filtro')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_PresentacionProd', jwtMW, async (req, res, next) => {
    var idBusqueda = req.query.idBusqueda;
    var IdSalon = req.query.IdSalon;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idBusqueda', sql.Int, idBusqueda)
                .input('IdSalon', sql.Int, IdSalon)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_PresentacionProd')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});


//=========================================================================
// TABLA EXTRA
// POST / GET
//=========================================================================
router.get('/Pa_MB_Extra', jwtMW, async (req, res, next) => {

    var IdProducto = req.query.IdProducto;
    var opcion = req.query.opcion;
    if (opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdProducto', sql.Int, IdProducto)
                .input('opcion', sql.Int, opcion)
                .execute('Pa_MB_Extra')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA PEDIDO
// POST / GET
//=========================================================================
router.post('/Pa_AEE_Pedido', jwtMW, async (req, res, next) => {


    var idPedido = req.body.idPedido;
    var IdCliente = req.body.IdCliente;
    var idAgente;

    if (req.body.idAgente == 0)
        idAgente = null;

    else
        idAgente = req.body.idAgente;

    var TipoPedido = req.body.TipoPedido;
    var FechaAtencion = req.body.FechaAtencion;
    var Observaciones = req.body.Observaciones;
    var idTurnoApertura = req.body.idTurnoApertura;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idPedido', sql.Int, idPedido)
            .input('idCliente', sql.Int, IdCliente)
            .input('idAgente', sql.Int, idAgente)
            .input('TipoPedido', sql.Char, TipoPedido)
            .input('FechaAtencion', sql.Date, FechaAtencion)
            .input('Observaciones', sql.VarChar, Observaciones)
            .input('idTurnoApertura', sql.Int, idTurnoApertura)
            .input('Opcion', sql.Int, opcion)  
            .output('Rpta')
            .execute('Pa_AEE_Pedido')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.put('/Pa_AEE_Pedido', jwtMW, async (req, res, next) => {

    var idPedido = req.body.idPedido;
    var IdCliente = req.body.IdCliente;
    var idAgente = req.body.idAgente;
    var TipoPedido = req.body.TipoPedido;
    var FechaAtencion = req.body.FechaAtencion;
    var Observaciones = req.body.Observaciones;
    var idTurnoApertura = req.body.idTurnoApertura;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idPedido', sql.Int, idPedido)
            .input('idCliente', sql.Int, IdCliente)
            .input('idAgente', sql.Int, idAgente)
            .input('TipoPedido', sql.Char, TipoPedido)
            .input('FechaAtencion', sql.Date, FechaAtencion)
            .input('Observaciones', sql.VarChar, Observaciones)
            .input('idTurnoApertura', sql.Int, idTurnoApertura)
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_Pedido')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA DETPEDIDO
// POST / GET
//=========================================================================

router.post('/Pa_AEE_DetPedido', jwtMW, async (req, res, next) => {

    var idDetPedido = req.body.idDetPedido;
    var idPedido = req.body.idPedido;
    var IdPreProd = req.body.IdPreProd;
    var Cantidad = req.body.Cantidad;
    var ValUnit = req.body.ValUnit;
    var DsctoUnitario = req.body.DsctoUnitario;
    var MontoISC = req.body.MontoISC;
    var PrecioVenta = req.body.PrecioVenta;
    var ValorVenta = req.body.ValorVenta;
    var MontoIGV = req.body.MontoIGV;
    var DescripExtra = req.body.DescripExtra;
    var HoraInicioPreparacion = req.body.HoraInicioPreparacion;
    var HoraFinPreparacion = req.body.HoraFinPreparacion;
    var IdAlquiler = req.body.IdAlquiler;
    var IdsInsumosExtras = req.body.IdsInsumosExtras;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idDetPedido', sql.Int, idDetPedido)
            .input('idPedido', sql.Int, idPedido)
            .input('idPreProducto', sql.Int, IdPreProd)
            .input('CantUnidad', sql.Decimal, Cantidad)
            .input('ValUnit', sql.Decimal, ValUnit)
            .input('DsctoUnitario', sql.Decimal, DsctoUnitario)
            .input('MontoISC', sql.Decimal, MontoISC)
            .input('MontoIGV', sql.Decimal, MontoIGV)
            .input('PrecioVenta', sql.Decimal, PrecioVenta)
            .input('ValorVenta', sql.Decimal, ValorVenta)    
            .input('DescripExtra', sql.VarChar, DescripExtra)
            .input('HoraInicioPreparacion', sql.DateTime, new Date(HoraInicioPreparacion))
            .input('HoraFinPreparacion', sql.DateTime, new Date(HoraFinPreparacion))
            .input('IdAlquiler', sql.Int, IdAlquiler)
            .input('IdInsumosExtras', sql.NVarChar, IdsInsumosExtras)
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_DetPedido')
        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.put('/Pa_AEE_DetPedido', jwtMW, async (req, res, next) => {

    var idDetPedido = req.body.idDetPedido;
    var idPedido = req.body.idPedido;
    var IdPreProd = req.body.IdPreProd;
    var Cantidad = req.body.Cantidad;
    var ValUnit = req.body.ValUnit;
    var DsctoUnitario = req.body.DsctoUnitario;
    var MontoISC = req.body.MontoISC;
    var PrecioVenta = req.body.PrecioVenta;
    var ValorVenta = req.body.ValorVenta;
    var MontoIGV = req.body.MontoIGV;
    var DescripExtra = req.body.DescripExtra;
    var HoraInicioPreparacion = req.body.HoraInicioPreparacion;
    var HoraFinPreparacion = req.body.HoraFinPreparacion;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idDetPedido', sql.Int, idDetPedido)
            .input('idPedido', sql.Int, idPedido)
            .input('idPreProducto', sql.Int, IdPreProd)
            .input('CantUnidad', sql.Decimal, Cantidad)
            .input('ValUnit', sql.Decimal, ValUnit)
            .input('DsctoUnitario', sql.Decimal, DsctoUnitario)
            .input('MontoISC', sql.Decimal, MontoISC)
            .input('MontoIGV', sql.Decimal, MontoIGV)
            .input('PrecioVenta', sql.Decimal, PrecioVenta)
            .input('ValorVenta', sql.Decimal, ValorVenta)
            .input('DescripExtra', sql.VarChar, DescripExtra)
            .input('HoraInicioPreparacion', sql.DateTime, new Date(HoraInicioPreparacion))
            .input('HoraFinPreparacion', sql.DateTime, new Date(HoraFinPreparacion))
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_DetPedido')
        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})


router.delete('/Pa_AEE_DetPedido', jwtMW, async (req, res, next) => {

    var idDetPedido = req.query.idDetPedido;
    var idPedido = req.query.idPedido;
    var IdPreProd = req.query.IdPreProd;
    var Cantidad = req.query.Cantidad;
    var ValUnit = req.query.ValUnit;
    var DsctoUnitario = req.query.DsctoUnitario;
    var MontoISC = req.query.MontoISC;
    var PrecioVenta = req.query.PrecioVenta;
    var ValorVenta = req.query.ValorVenta;
    var MontoIGV = req.query.MontoIGV;
    var DescripExtra = req.query.DescripExtra;
    var HoraInicioPreparacion = req.query.HoraInicioPreparacion;
    var HoraFinPreparacion = req.query.HoraFinPreparacion;
    var opcion = req.query.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idDetPedido', sql.Int, idDetPedido)
            .input('idPedido', sql.Int, idPedido)
            .input('idPreProducto', sql.Int, IdPreProd)
            .input('CantUnidad', sql.Decimal, Cantidad)
            .input('ValUnit', sql.Decimal, ValUnit)
            .input('DsctoUnitario', sql.Decimal, DsctoUnitario)
            .input('MontoISC', sql.Decimal, MontoISC)
            .input('MontoIGV', sql.Decimal, MontoIGV)
            .input('PrecioVenta', sql.Decimal, PrecioVenta)
            .input('ValorVenta', sql.Decimal, ValorVenta)
            .input('DescripExtra', sql.VarChar, DescripExtra)
            .input('HoraInicioPreparacion', sql.DateTime, new Date(HoraInicioPreparacion))
            .input('HoraFinPreparacion', sql.DateTime, new Date(HoraFinPreparacion))
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_DetPedido')
        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.get('/Pa_MB_DetPedido', jwtMW, async (req, res, next) => {
    var Opcion = req.query.Opcion;
    var Busqueda = req.query.Busqueda;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('Texto', sql.VarChar, Busqueda)
                .execute('Pa_MB_DetPedido')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA MESA PEDIDO
// POST / GET
//=========================================================================

router.post('/Pa_AEE_Mesa_Pedido', jwtMW, async (req, res, next) => {


    var idMesa = req.body.idMesa;
    var idPedido = req.body.idPedido;
    var FechaPedido = req.body.FechaPedido;
    var DesdeApp = req.body.DesdeApp;
    var PreCuenta = req.body.PreCuenta;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idMesa', sql.Int, idMesa)
            .input('idPedido', sql.Int, idPedido)
            .input('FechaPedido', sql.Date, FechaPedido)
            .input('DesdeApp', sql.Int, DesdeApp)
            .input('PreCuenta', sql.Int, PreCuenta)
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_Mesa_Pedido')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.put('/Pa_AEE_Mesa_Pedido', jwtMW, async (req, res, next) => {


    var idMesa = req.body.idMesa;
    var idPedido = req.body.idPedido;
    var FechaPedido = req.body.FechaPedido;
    var DesdeApp = req.body.DesdeApp;
    var PreCuenta = req.body.PreCuenta;
    var opcion = req.body.opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idMesa', sql.Int, idMesa)
            .input('idPedido', sql.Int, idPedido)
            .input('FechaPedido', sql.Date, FechaPedido)
            .input('DesdeApp', sql.Int, DesdeApp)
            .input('PreCuenta', sql.Int, PreCuenta)
            .input('Opcion', sql.Int, opcion)
            .output('Rpta')
            .execute('Pa_AEE_Mesa_Pedido')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.get('/Pa_MB_Mesa_Pedido', jwtMW, async (req, res, next) => {
    var Opcion = req.query.Opcion;
    var Busqueda = req.query.Busqueda;
    var idSalon = req.query.idSalon;
    var idPantalla = req.query.idPantalla;
    var Busqueda2 = req.query.Busqueda2;
    if (idSalon != null && Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('Busqueda', sql.VarChar, Busqueda)
                .input('idSalon', sql.Int, idSalon)
                .input('idPantalla', sql.Int, idPantalla)
                .input('Busqueda2', sql.VarChar, Busqueda2)
                .execute('Pa_MB_Mesa_Pedido')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA VALES
// POST / GET
//=========================================================================

router.post('/Pa_AEE_TabVale', jwtMW, async (req, res, next) => {


    var idVale = req.body.idVale;
    var idOperacion = req.body.idOperacion;
    var idComprobante = req.body.idComprobante;
    var idAlmacen = req.body.idAlmacen;
    var Descripcion = req.body.Descripcion;
    var TipoVale = req.body.TipoVale;
    var Numero = req.body.Numero;
    var Fecha = req.body.Fecha;
    var FechaIngreso = req.body.FechaIngreso;
    var idCosto = req.body.idCosto;

    var idAgente;

    if (req.body.idAgente == 0)
        idAgente = null;

    else
        idAgente = req.body.idAgente;

    var idValeRef = req.body.idValeRef;

    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idVale', sql.Int, idVale)
            .input('idOperacion', sql.Int, idOperacion)
            .input('idComprobante', sql.Int, idComprobante)
            .input('idAlmacen', sql.Int, idAlmacen)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('TipoVale', sql.Char, TipoVale)
            .input('Numero', sql.VarChar, Numero)
            .input('Fecha', sql.Date, Fecha)
            .input('FechaIngreso', sql.Date, FechaIngreso)
            .input('idCosto', sql.Int, idCosto)
            .input('idAgente', sql.Int, idAgente)
            .input('idValeRef', sql.Int, idValeRef)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_TabVale')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.put('/Pa_AEE_TabVale', jwtMW, async (req, res, next) => {


    var idVale = req.body.idVale;
    var idOperacion = req.body.idOperacion;
    var idComprobante = req.body.idComprobante;
    var idAlmacen = req.body.idAlmacen;
    var Descripcion = req.body.Descripcion;
    var TipoVale = req.body.TipoVale;
    var Numero = req.body.Numero;
    var Fecha = req.body.Fecha;
    var FechaIngreso = req.body.FechaIngreso;
    var idCosto = req.body.idCosto;

    var idAgente;

    if (req.body.idAgente == 0)
        idAgente = null;

    else
        idAgente = req.body.idAgente;

    var idValeRef = req.body.idValeRef;

    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idVale', sql.Int, idVale)
            .input('idOperacion', sql.Int, idOperacion)
            .input('idComprobante', sql.Int, idComprobante)
            .input('idAlmacen', sql.Int, idAlmacen)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('TipoVale', sql.Char, TipoVale)
            .input('Numero', sql.VarChar, Numero)
            .input('Fecha', sql.Date, Fecha)
            .input('FechaIngreso', sql.Date, FechaIngreso)
            .input('idCosto', sql.Int, idCosto)
            .input('idAgente', sql.Int, idAgente)
            .input('idValeRef', sql.Int, idValeRef)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_TabVale')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.post('/Pa_AEE_DetVale', jwtMW, async (req, res, next) => {


    var idDetVale = req.body.idDetVale;
    var idVale = req.body.idVale;
    var idStock = req.body.idStock;

    var idSPSalida;

    if (req.body.idSPSalida == 0)
        idSPSalida = null;

    else
        idSPSalida = req.body.idSPSalida;

    var Cantidad = req.body.Cantidad;
    var Monto = req.body.Monto;
    var idAlmacen = req.body.idAlmacen;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idDetVale', sql.Int, idDetVale)
            .input('idVale', sql.Int, idVale)
            .input('idStock', sql.Int, idStock)
            .input('idSPSalida', sql.Int, idSPSalida)
            .input('Cantidad', sql.Float, Cantidad)
            .input('Monto', sql.Decimal, Monto)
            .input('idAlmacen', sql.Int, idAlmacen)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_DetVale')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA CLIENTES
// POST / GET
//=========================================================================

router.get('/Pa_MB_Clientes', jwtMW, async (req, res, next) => {
    var Opcion = req.query.Opcion;
    var Busqueda = req.query.Busqueda;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('TextoBuscar', sql.VarChar, Busqueda)
                .execute('Pa_MB_Clientes')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.post('/Pa_AEE_Clientes', jwtMW, async (req, res, next) => {

    var IdCliente = req.body.IdCliente;
    var RazonSocial = req.body.RazonSocial;
    var Direccion = req.body.Direccion;
    var NumeroDoc = req.body.NumeroDoc;
    var TelefonoReal = req.body.TelefonoReal;
    var CelularReal = req.body.CelularReal;
    var Correo = req.body.Correo;
    var FNacimiento = req.body.FNacimiento;
    var idTipDoCliente = req.body.idTipDoCliente;
    var RefDireccion = req.body.RefDireccion;
    var IdUbigeo = req.body.IdUbigeo;
    var DocVerificado = req.body.DocVerificado;
    var LimiteCredito = req.body.LimiteCredito;
    var IdDireccion = req.body.IdDireccion;
    var IdClienteDireccion = req.body.IdClienteDireccion;
    var TipoDireccion = req.body.TipoDireccion;
    var Opcion = req.body.Opcion;


    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdCliente', sql.Int, IdCliente)
            .input('Nombre', sql.VarChar, RazonSocial)
            .input('Direccion', sql.VarChar, Direccion)
            .input('NumeroDoc', sql.VarChar, NumeroDoc)
            .input('Telefono', sql.VarChar, TelefonoReal)
            .input('Celular', sql.VarChar, CelularReal)
            .input('Correo', sql.VarChar, Correo)
            .input('FechaNac', sql.Date, FNacimiento)
            .input('IdTipDocIdentidad', sql.Int, idTipDoCliente)
            .input('RefDireccion', sql.VarChar, RefDireccion)
            .input('IdUbigeo', sql.Int, IdUbigeo)
            .input('LimiteCredito', sql.Decimal, LimiteCredito)
            .input('DocVerificado', sql.Bit, DocVerificado)
            .input('Empleado', sql.Bit, 0)
            .input('IdDireccion', sql.Int, IdDireccion)
            .input('IdClienteDireccion', sql.Int, IdClienteDireccion)
            .input('TipoDireccion', sql.Char, TipoDireccion)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_Clientes')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA COMPROBANTE PAGO
// POST / GET
//=========================================================================

router.get('/Pa_MB_TipCompPago', jwtMW, async (req, res, next) => {
    var Opcion = req.query.Opcion;
    var IdTipCompPago = req.query.IdTipCompPago;
    var TextoBuscar = req.query.TextoBuscar;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('IdTipCompPago', sql.Int, IdTipCompPago)
                .input('TextoBuscar', sql.VarChar, TextoBuscar)
                .execute('Pa_MB_TipCompPago')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA CLIENTE DIRECCION
// POST / GET
//=========================================================================

router.get('/Pa_MB_Direccion_Sede_Cliente', jwtMW, async (req, res, next) => {
    var Opcion = req.query.Opcion;
    var IdCliente = req.query.IdCliente;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .input('IdCliente', sql.Int, IdCliente)
                .execute('Pa_MB_Direccion_Sede_Cliente')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA SALIDAS
// POST / GET
//=========================================================================

router.get('/Pa_MB_Salida', jwtMW, async (req, res, next) => {

    var Texto = req.query.Texto;
    var IdSalida = req.query.IdSalida;
    var Serie = req.query.Serie;
    var NumSerie = req.query.NumSerie;
    var IdTipoCompPago = req.query.IdTipoCompPago;
    var opcion = req.query.opcion;
    if (opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Texto', sql.VarChar, Texto)
                .input('idSalida', sql.Int, IdSalida)
                .input('serie', sql.VarChar, Serie)
                .input('Numero', sql.VarChar, NumSerie)
                .input('IdTipCompPago', sql.Int, IdTipoCompPago)
                .input('Opcion', sql.Int, opcion)
                .execute('Pa_MB_Salida')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.post('/Pa_AEE_Salida', jwtMW, async (req, res, next) => {

    var IdSalida = req.body.IdSalida;
    var IdOperacion = req.body.IdOperacion;
    var FechaEmision = req.body.FechaEmision;
    var IdConceptoNotas;

    if (req.body.IdConceptoNotas == 0)
        IdConceptoNotas = null;
    
    else
        IdConceptoNotas = req.body.IdConceptoNotas;

    var CodDomFiscal = req.body.CodDomFiscal;
    var GlosaNota = req.body.GlosaNota;
    var IdCliente = req.body.IdCliente;
    var IdClienteDireccion = req.body.IdClienteDireccion;
    var IdMoneda = req.body.IdMoneda;
    var DsctoGlobal = req.body.DsctoGlobal;
    var SumOtrosCargos = req.body.SumOtrosCargos;
    var TotalDscto = req.body.TotalDscto;
    var TotalVentaOG = req.body.TotalVentaOG;
    var TotalVentaOI = req.body.TotalVentaOI;
    var TotalVentaOE = req.body.TotalVentaOE;
    var TotalVenta_Gratuita = req.body.TotalVenta_Gratuita;
    var SumIGV = req.body.SumIGV;
    var SumISC = req.body.SumISC;
    var SumOtrosAtributos = req.body.SumOtrosAtributos;
    var ImporteVentaTotal = req.body.ImporteVentaTotal;
    var Serie = req.body.Serie;
    var NumSerie = req.body.NumSerie;
    var SaldoInicial = req.body.SaldoInicial;
    var EstadoSalida = req.body.EstadoSalida;
    var EnvioFacturador = req.body.EnvioFacturador;
    var IdLocal = req.body.IdLocal;
    var IdAgente;

    if (req.body.IdAgente == 0)
        IdAgente = null;

    else
        IdAgente = req.body.IdAgente;

    var IdCompPago = req.body.IdCompPago;
    var IdUsuario = req.body.IdUsuario;
    var IdFormaPago = req.body.IdFormaPago;
    var NumRefFormaPago = req.body.NumRefFormaPago;
    var IdSalidaRefPrin;

    if (req.body.IdSalidaRefPrin == 0)
        IdSalidaRefPrin = null;

    else
        IdSalidaRefPrin = req.body.IdSalidaRefPrin;

    var IdSalidaRefSec = req.body.IdSalidaRefSec;


    if (req.body.IdSalidaRefSec == 0)
        IdSalidaRefSec = null;

    else
        IdSalidaRefSec = req.body.IdSalidaRefSec;

    var NombreOpcional = req.body.NombreOpcional;
    var EnviadoPorCorreo = req.body.EnviadoPorCorreo;
    var SubidoHosting = req.body.SubidoHosting;
    var Anulado_NotaCredito_CBA = req.body.Anulado_NotaCredito_CBA;
    var FechaAnulacion = req.body.FechaAnulacion;
    var IdUsuarioAnulacion = req.body.IdUsuarioAnulacion;
    var IdPedido = req.body.IdPedido;
    var idTurnoApertura = req.body.idTurnoApertura;
    var MontoEfectivo = req.body.MontoEfectivo;
    var CambioEfectivo = req.body.CambioEfectivo;
    var HoraEmision = req.body.HoraEmision;
    var FormaDeEmisionCPE = req.body.FormaDeEmisionCPE;
    var EnviadoPorResumenDiario = req.body.EnviadoPorResumenDiario;
    var EnviadoPorComuniBaja = req.body.EnviadoPorComuniBaja;
    var CodigoTipoFactura_Cat51 = req.body.CodigoTipoFactura_Cat51;
    var EnviadoPorResumenBaja = req.body.EnviadoPorResumenBaja;
    var CodigoCDR = req.body.CodigoCDR;
    var DireccionEntrega = req.body.DireccionEntrega;
    var CelularEntrega = req.body.CelularEntrega;
    var IdSalon = req.body.IdSalon;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idSalida', sql.Int, IdSalida)
            .input('IdOperacion', sql.Int, IdOperacion)
            .input('FechaEmision', sql.Date, FechaEmision)
            .input('idConceptoNotas', sql.Int, IdConceptoNotas)
            .input('CodDomFiscal', sql.Char, CodDomFiscal)
            .input('GlosaNota', sql.VarChar, GlosaNota)
            .input('IdCliente', sql.Int, IdCliente)
            .input('IdMoneda', sql.Int, IdMoneda)
            .input('DsctoGlobal', sql.Decimal, DsctoGlobal)
            .input('SumOtrosCargos', sql.Decimal, SumOtrosCargos)
            .input('TotalDscto', sql.Decimal, TotalDscto)
            .input('TotalValCompra_OG', sql.Decimal, TotalVentaOG)
            .input('TotalValCompra_OI', sql.Decimal, TotalVentaOI)
            .input('TotalValCompra_OE', sql.Decimal, TotalVentaOE)
            .input('SumIGV', sql.Decimal, SumIGV)
            .input('SumISC', sql.Decimal, SumISC)
            .input('SumOtrosAtributos', sql.Decimal, SumOtrosAtributos)
            .input('ImporteVentaTotal', sql.Decimal, ImporteVentaTotal)
            .input('Serie', sql.VarChar, Serie)
            .input('Numero', sql.VarChar, NumSerie)
            .input('SaldoInicial', sql.VarChar, SaldoInicial)
            .input('EstadoSalida', sql.VarChar, EstadoSalida)
            .input('EnviadoFacturador', sql.VarChar, EnvioFacturador)
            .input('IdLocal', sql.Int, IdLocal)
            .input('idAgentes', sql.Int, IdAgente)
            .input('IdTipCompPago', sql.Int, IdCompPago)
            .input('IdUsuario', sql.Int, IdUsuario)
            .input('IdFormaPago', sql.Int, IdFormaPago)
            .input('NumRefFormaPago', sql.VarChar, NumRefFormaPago)
            .input('idSalidaRefPrin', sql.Int, IdSalidaRefPrin)
            .input('idSalidaRefSec', sql.Int, IdSalidaRefSec)
            .input('CuotaInicial', sql.Decimal, 0)
            .input('CantLetras', sql.Int, 0)
            .input('NombreOpcional', sql.VarChar, NombreOpcional)
            .input('DetUnido', sql.Bit, 0)
            .input('PorcentInteres', sql.Decimal, 0)
            .input('GuiaRemision', sql.Bit, 0)
            .input('IdTipoCambio', sql.Int, null)
            .input('EnviadoPorCorreo', sql.Bit, EnviadoPorCorreo)
            .input('SubidoAlWebHosting', sql.Bit, SubidoHosting)
            .input('Anulado_NotaCredito_CBA', sql.Char, Anulado_NotaCredito_CBA)
            .input('FechaAnulacion', sql.Date, FechaAnulacion)
            .input('IdUsuarioAnulacion', sql.Int, IdUsuarioAnulacion)
            .input('idPedido', sql.Int, IdPedido)
            .input('idTurno', sql.Int, idTurnoApertura)
            .input('MontoEfectivo', sql.Decimal, MontoEfectivo)
            .input('CambioEfectivo', sql.Decimal, CambioEfectivo)
            .input('TotalVenta_Gratuita', sql.Decimal, TotalVenta_Gratuita)
            .input('IdClienteDireccion', sql.Int, IdClienteDireccion)
            .input('HoraEmision', sql.NVarChar, HoraEmision)
            .input('FormaDeEmisionCPE', sql.Int, FormaDeEmisionCPE)
            .input('EnviadoPorResumenDiario', sql.Bit, EnviadoPorResumenDiario)
            .input('EnviadoPorComuniBaja', sql.Bit, EnviadoPorComuniBaja)
            .input('CodigoTipoFactura_Cat51', sql.NVarChar, CodigoTipoFactura_Cat51)
            .input('EnviadoPorResumenBaja', sql.Bit, EnviadoPorResumenBaja)
            .input('CodigoEstadoCDR', sql.NVarChar, CodigoCDR)
            .input('DireccionEntrega', sql.NVarChar, DireccionEntrega)
            .input('CelularEntrega', sql.NVarChar, CelularEntrega)
            .input('IdSalon', sql.Int, IdSalon)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_Salida')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA FORMA DE PAGO SALIDAS
// POST / GET
//=========================================================================

router.post('/Pa_AEE_FormaPago_Salidas', jwtMW, async (req, res, next) => {

    var IdFormaPago_Salidas = req.body.IdFormaPago_Salidas;
    var IdSalida = req.body.IdSalida;
    var IdFormaPago = req.body.IdFormaPago;
    var IdValeConsumo;
    var IdAlquiler;

    if (req.body.IdValeConsumo == 0)
        IdValeConsumo = null;

    else
        IdValeConsumo = req.body.IdValeConsumo;

    var Monto = req.body.Monto;

    if (req.body.IdAlquiler == 0)
        IdAlquiler = null;

    else
        IdAlquiler = req.body.IdAlquiler;

    var FechaRegistro = req.body.FechaRegistro;

    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdFormaPago_Salidas', sql.Int, IdFormaPago_Salidas)
            .input('IdSalida', sql.Int, IdSalida)
            .input('IdFormaPago', sql.Int, IdFormaPago)
            .input('IdValeConsumo', sql.Int, IdValeConsumo)
            .input('Monto', sql.Decimal, Monto)
            .input('IdAlquiler', sql.Int, IdAlquiler)
            .input('FechaRegistro', sql.Date, FechaRegistro)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_FormaPago_Salidas')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA DETALLE SALIDAS
// POST / GET
//=========================================================================

router.post('/Pa_AEE_DetSalida', jwtMW, async (req, res, next) => {

    var idDetSalida = req.body.idDetSalida;
    var cantidad = req.body.cantidad;
    var ValUnitario = req.body.ValUnitario;
    var descuento = req.body.descuento;
    var MontoIGV = req.body.MontoIGV;
    var MontoISC = req.body.MontoISC;
    var precioVenta = req.body.precioVenta;
    var ValorVenta = req.body.ValorVenta;
    var idPresentProd = req.body.idPresentProd;
    var idSalida = req.body.idSalida;

    var idSerieProducto;

    if (req.body.idSerieProducto == 0)
        idSerieProducto = null;

    else
        idSerieProducto = req.body.idSerieProducto;

    var CodAfectacionIGV = req.body.CodAfectacionIGV;

    var idConceptoNotas;

    if (req.body.idConceptoNotas == 0)
        idConceptoNotas = null;

    else
        idConceptoNotas = req.body.idConceptoNotas;

    var CantOtraUnd = req.body.CantOtraUnd;

    var DescripcionAdicional = req.body.DescripcionAdicional;

    if (req.body.IDAlquiler_Producto == 0)
        IDAlquiler_Producto = null;
    else
        IDAlquiler_Producto = req.body.IDAlquiler_Producto;

    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('IdDetSalida', sql.Int, idDetSalida)
            .input('CantUnidad', sql.Decimal, cantidad)
            .input('ValorUnit', sql.Decimal, ValUnitario)
            .input('DsctoUnitario', sql.Decimal, descuento)
            .input('MontoIGV', sql.Decimal, MontoIGV)
            .input('MontoISC', sql.Decimal, MontoISC)
            .input('PrecioVenta', sql.Decimal, precioVenta)
            .input('ValorVenta', sql.Decimal, ValorVenta)
            .input('IdPresenProducto', sql.Int, idPresentProd)
            .input('idSalida', sql.Int, idSalida)
            .input('idSerieProducto', sql.Int, idSerieProducto)
            .input('idConceptoNotas', sql.Int, idConceptoNotas)
            .input('CodAfectacionIGV', sql.VarChar, CodAfectacionIGV)
            .input('CantOtraUnd', sql.Decimal, CantOtraUnd)
            .input('DescripcionAdicional', sql.VarChar, DescripcionAdicional)
            .input('IDAlquiler_Producto', sql.Int, IDAlquiler_Producto)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_AEE_DetSalida')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

//=========================================================================
// TABLA IMPRESORAS FAMILIA
// POST / GET
//=========================================================================

router.get('/Pa_MB_Familia_Impresora', jwtMW, async (req, res, next) => {

    var Busqueda = req.query.Busqueda;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Busqueda', sql.Int, Busqueda)
                .input('Opcion', sql.VarChar, Opcion)
                .execute('Pa_MB_Familia_Impresora')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});


//=========================================================================
// TABLA CONFIGURACIONES
// POST / GET
//=========================================================================

router.put('/Pa_ActualizarNro_Configuracion', jwtMW, async (req, res, next) => {

    var idConfiguracion = req.body.idConfiguracion;
    var Numero = req.body.Numero;
    var Opcion = req.body.Opcion;

    try {
        const pool = await poolPromise
        const queryResult = await pool.request()
            .input('idConfiguracion', sql.Int, idConfiguracion)
            .input('Numero', sql.VarChar, Numero)
            .input('Opcion', sql.Int, Opcion)
            .output('Rpta')
            .execute('Pa_ActualizarNro_Configuracion')

        if (queryResult.output != null) {
            const ID = queryResult.output.Rpta
            res.end(JSON.stringify({ success: true, message: ID }));
        }
        else {
            res.send(JSON.stringify({ success: false, message: err.message }))
        }

    }
    catch (err) {
        res.status(500) //Internal Server Error
        res.send(JSON.stringify({ success: false, message: err.message }));
    }

})

router.get('/Pa_MB_Configuraciones', jwtMW, async (req, res, next) => {

    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Configuraciones')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});


//=========================================================================
// ARQUEO DE CAJA
// POST / GET
//=========================================================================

router.get('/Pa_RPT_ResVtasxFPago_turno', jwtMW, async (req, res, next) => {

    var idturno = req.query.idturno;
    var idUsuario = req.query.idUsuario;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idturno', sql.Int, idturno)
                .input('idUsuario', sql.Int, idUsuario)
                .input('PorFechas', sql.TinyInt, 0)
                .input('FechaInicio', sql.Date, new Date())
                .input('FechaFin', sql.Date, new Date())
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_RPT_ResVtasxFPago_turno')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_Producto_Turno', jwtMW, async (req, res, next) => {

    var idTurnoApertura = req.query.idTurnoApertura;
    var idUsuario = req.query.idUsuario;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idTurnoApertura', sql.Int, idTurnoApertura)
                .input('idUsuario', sql.Int, idUsuario)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Producto_Turno')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_Producto_TipoPedido', jwtMW, async (req, res, next) => {

    var idTurnoApertura = req.query.idTurnoApertura;
    var idUsuario = req.query.idUsuario;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idTurnoApertura', sql.Int, idTurnoApertura)
                .input('idUsuario', sql.Int, idUsuario)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Producto_TipoPedido')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

router.get('/Pa_MB_Producto_Insumo', jwtMW, async (req, res, next) => {

    var idTurnoApertura = req.query.idTurnoApertura;
    var idUsuario = req.query.idUsuario;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('idTurnoApertura', sql.Int, idTurnoApertura)
                .input('idUsuario', sql.Int, idUsuario)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_Producto_Insumo')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TIPO DOCUMENTOAEE_D
// POST / GET
//=========================================================================

router.get('/Pa_MB_TipDocIdentificacion', jwtMW, async (req, res, next) => {

    var IdTipDoc = req.query.IdTipDoc;
    var Opcion = req.query.Opcion;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdTipDocIdent', sql.Int, IdTipDoc)
                .input('Opcion', sql.Int, Opcion)
                .execute('Pa_MB_TipDocIdentificacion')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// GENERAR CPE
//  GET
//=========================================================================

router.get('/Pa_Generar_CPE', jwtMW, async (req, res, next) => {

    var IdSalida = req.query.IdSalida;
    var Opcion = req.query.Opcion;
    var DesdeApp = req.query.DesdeApp;
    if (Opcion != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('IdSalida', sql.Int, IdSalida)
                .input('Opcion', sql.Int, Opcion)
                .input('DesdeApp', sql.Int, DesdeApp)
                .execute('Pa_Generar_CPE')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
             
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing codigo in query" }));
    }

});

//=========================================================================
// TABLA TOKEN
// POST / GET
//=========================================================================

router.get('/token', jwtMW, async (req, res, next) => {

    var fbid = req.query.fbid;
    if (fbid != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, 1)
                .input('FBID', sql.NVarChar, fbid)
                .input('TOKEN', sql.NVarChar, 0) //NO SE USA PERO EL PROCEDIMIENTO LO ESPERA
                .execute('PA_POST_GET_Token')
            //.query('SELECT FBID, Token FROM Token where FBID = FBID')

            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: "Empty" }));
            }
        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
    else {
        res.send(JSON.stringify({ success: false, message: "Missing fbid in JWT" }));
    }

});

router.post('/token', jwtMW, async (req, res, next) => {

    var authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    }
    catch (e) {
        return res.status(401).send('Unauthorized');
    }

    var fbid = decoded.fbid;
    var token = req.body.token;
    if (fbid != null) {
        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('Opcion', sql.Int, 2)
                .input('FBID', sql.NVarChar, fbid)
                .input('TOKEN', sql.NVarChar, token)
                .execute('PA_POST_GET_Token')
            /*.query('IF EXISTS(SELECT * FROM Token WHERE FBID = FBID)'
                + ' UPDATE Token set Token = TOKEN WHERE FBID = FBID'
                + ' ELSE'
                + ' INSERT INTO Token (FBID, Token) OUTPUT Inserted.FBID, Inserted.Token'
                + ' VALUES(FBID, TOKEN)'
            );*/

            console.log(queryResult); //Debug to see

            if (queryResult.rowsAffected != null) {
                res.send(JSON.stringify({ success: true, message: "Success" }))
            }


        }
        catch (err) {
            res.status(500) //Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    } else {
        res.send(JSON.stringify({ success: false, message: "Missing fbid in JWT" }));
    }

})

module.exports = router;
