const { sql } = require('../database/db');

// Obtener todas las auditorías
async function getAuditorias(req, res) {
    try {
        const result = await sql.query('SELECT * FROM AuditoriaCuenta');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las auditorías', details: err });
    }
}

// Crear una nueva auditoría
async function createAuditoria(req, res) {
    const { CodigoCuenta, Accion } = req.body;
    console.log("Creando auditoría con los datos:", req.body);
    try {
        await sql.query(`
            INSERT INTO AuditoriaCuenta (CodigoCuenta, Accion)
            VALUES ('${CodigoCuenta}', '${Accion}')
        `);

        const result = await sql.query(`
            SELECT * FROM AuditoriaCuenta WHERE CodigoCuenta = '${CodigoCuenta}' AND Accion = '${Accion}'
        `);

        const nuevaAuditoria = result.recordset[0];
        // Devolver la nueva auditoría
        res.status(201).json(nuevaAuditoria);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la auditoría', details: err });
    }
}

// Actualizar una auditoría existente
async function updateAuditoria(req, res) {
    const { id } = req.params;
    const { CodigoCuenta, Accion } = req.body;
    try {
        await sql.query(`
            UPDATE AuditoriaCuenta
            SET CodigoCuenta = '${CodigoCuenta}', Accion = '${Accion}'
            WHERE IdAuditoria = ${id}
        `);

        const result = await sql.query(`
            SELECT * FROM AuditoriaCuenta WHERE IdAuditoria = ${id}
        `);

        if (result.recordset.length > 0) {
            const auditoriaActualizada = result.recordset[0];
            res.json(auditoriaActualizada);
        } else {
            res.status(404).json({ error: 'Auditoría no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la auditoría', details: err });
    }
}

// Eliminar una auditoría
async function deleteAuditoria(req, res) {
    const { id } = req.params;
    try {
        const result = await sql.query(`
            DELETE FROM AuditoriaCuenta WHERE IdAuditoria = ${id}
        `);
        res.json({ message: 'Auditoría eliminada exitosamente', data: result.recordset });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la auditoría', details: err });
    }
}

module.exports = { getAuditorias, createAuditoria, updateAuditoria, deleteAuditoria };
