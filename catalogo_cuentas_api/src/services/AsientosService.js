const { sql } = require('../database/db');

// Obtener todos los asientos
async function getAsientos(req, res) {
    try {
        const result = await sql.query('SELECT * FROM ContabilidadDB.dbo.Asiento');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los asientos', details: err });
    }
}

// Crear un asiento
async function createAsiento(req, res) {
    const { fecha, descripcion, detalles } = req.body; // 'detalles' será un array de detalles de asiento

    try {
        // Insertar el asiento principal
        const result = await sql.query(`
            INSERT INTO ContabilidadDB.dbo.Asiento (fecha, descripcion)
            VALUES ('${fecha}', '${descripcion}')
            SELECT SCOPE_IDENTITY() AS idAsiento
        `);
        const idAsiento = result.recordset[0].idAsiento;

        // Insertar los detalles de asiento
        for (let detalle of detalles) {
            const { CodigoCuenta, debe, haber } = detalle;
            await sql.query(`
                INSERT INTO ContabilidadDB.dbo.DetalleAsiento (idAsiento, CodigoCuenta, debe, haber)
                VALUES ('${idAsiento}', '${CodigoCuenta}', ${debe}, ${haber})
            `);
        }

        // Devolver el asiento creado con sus detalles
        const nuevoAsiento = await sql.query(`
            SELECT * FROM ContabilidadDB.dbo.Asiento WHERE idAsiento = ${idAsiento}
        `);

        const detallesAsiento = await sql.query(`
            SELECT * FROM ContabilidadDB.dbo.DetalleAsiento WHERE idAsiento = ${idAsiento}
        `);

        res.status(201).json({ asiento: nuevoAsiento.recordset[0], detalles: detallesAsiento.recordset });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el asiento', details: err });
    }
}

// Actualizar un asiento
async function updateAsiento(req, res) {
    const { idAsiento, fecha, descripcion, detalles } = req.body;

    try {
        // Actualizar el asiento
        await sql.query(`
            UPDATE ContabilidadDB.dbo.Asiento
            SET fecha = '${fecha}', descripcion = '${descripcion}'
            WHERE idAsiento = ${idAsiento}
        `);

        // Eliminar detalles existentes
        await sql.query(`
            DELETE FROM ContabilidadDB.dbo.DetalleAsiento WHERE idAsiento = ${idAsiento}
        `);

        // Insertar los nuevos detalles de asiento
        for (let detalle of detalles) {
            const { CodigoCuenta, debe, haber } = detalle;
            await sql.query(`
                INSERT INTO ContabilidadDB.dbo.DetalleAsiento (idAsiento, CodigoCuenta, debe, haber)
                VALUES ('${idAsiento}', '${CodigoCuenta}', ${debe}, ${haber})
            `);
        }

        // Obtener el asiento actualizado
        const actualizadoAsiento = await sql.query(`
            SELECT * FROM ContabilidadDB.dbo.Asiento WHERE idAsiento = ${idAsiento}
        `);

        const detallesAsiento = await sql.query(`
            SELECT * FROM ContabilidadDB.dbo.DetalleAsiento WHERE idAsiento = ${idAsiento}
        `);

        res.json({ asiento: actualizadoAsiento.recordset[0], detalles: detallesAsiento.recordset });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el asiento', details: err });
    }
}

// Eliminar un asiento
async function deleteAsiento(req, res) {
    const { idAsiento } = req.params;
    try {
        // Eliminar los detalles del asiento
        await sql.query(`
            DELETE FROM ContabilidadDB.dbo.DetalleAsiento WHERE idAsiento = ${idAsiento}
        `);

        // Eliminar el asiento
        await sql.query(`
            DELETE FROM ContabilidadDB.dbo.Asiento WHERE idAsiento = ${idAsiento}
        `);

        res.json({ message: 'Asiento eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el asiento', details: err });
    }
}

module.exports = { getAsientos, createAsiento, updateAsiento, deleteAsiento };