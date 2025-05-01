const { sql } = require('../database/db');

async function getLibroMayor(req, res) {
    const { fechaInicio, fechaFin } = req.query;
    console.log(fechaInicio, fechaFin);

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Debes proporcionar fechaInicio y fechaFin en el query' });
    }

    try {
        const result = await sql.query(`
            SELECT 
                d.CodigoCuenta,
                a.fecha,
                d.debe,
                d.haber
            FROM ContabilidadDB.dbo.DetalleAsiento d
            INNER JOIN ContabilidadDB.dbo.Asiento a ON d.idAsiento = a.idAsiento
            WHERE a.fecha BETWEEN '${fechaInicio}' AND '${fechaFin}'
            ORDER BY d.CodigoCuenta, a.fecha;
        `);

        console.log(result.recordset);

        const libro = {};

        result.recordset.forEach(({ CodigoCuenta, fecha, debe, haber }) => {
            if (!libro[CodigoCuenta]) {
                libro[CodigoCuenta] = {
                    CodigoCuenta,
                    movimientos: [],
                    saldo: 0
                };
            }

            libro[CodigoCuenta].movimientos.push({ fecha, debe, haber });
            libro[CodigoCuenta].saldo += (debe - haber);
        });

        res.json(Object.values(libro));
    } catch (err) {
        console.error('Error al obtener el libro mayor:', err);
        res.status(500).json({ error: 'Error al obtener el libro mayor', details: err });
    }
}

module.exports = { getLibroMayor };