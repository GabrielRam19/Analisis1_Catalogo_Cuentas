const { sql } = require('../database/db');

// Obtener todas las jerarquías de cuentas
async function getJerarquia(req, res) {
    try {
        const result = await sql.query('SELECT * FROM JerarquiaCuenta');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las jerarquías', details: err });
    }
}

// Crear una nueva jerarquía
async function createJerarquia(req, res) {
    const { CodigoCuentaPadre, CodigoCuentaHijo, Nivel } = req.body;
    try {
        const result = await sql.query(`
            INSERT INTO JerarquiaCuenta (CodigoCuentaPadre, CodigoCuentaHijo, Nivel)
            OUTPUT INSERTED.IdJerarquia, INSERTED.CodigoCuentaPadre, INSERTED.CodigoCuentaHijo, INSERTED.Nivel
            VALUES ('${CodigoCuentaPadre}', '${CodigoCuentaHijo}', ${Nivel})
        `);

        const nuevaJerarquia = result.recordset[0];
        res.status(201).json(nuevaJerarquia);
    } catch (err) {
        console.error('Error al crear la jerarquía:', err);
        res.status(500).json({ error: 'Error al crear la jerarquía', details: err });
    }
}

// Actualizar una jerarquía
async function updateJerarquia(req, res) {
    const { id } = req.params;
    const { CodigoCuentaPadre, CodigoCuentaHijo, Nivel } = req.body;
    try {
        await sql.query(`
            UPDATE JerarquiaCuenta
            SET CodigoCuentaPadre = '${CodigoCuentaPadre}', CodigoCuentaHijo = '${CodigoCuentaHijo}', Nivel = ${Nivel}
            WHERE IdJerarquia = ${id}
        `);

        const result = await sql.query(`
            SELECT * FROM JerarquiaCuenta WHERE IdJerarquia = ${id}
        `);

        if (result.recordset.length > 0) {
            const jerarquiaActualizada = result.recordset[0];
            // Se devuelve la jerarquía actualizada
            res.json(jerarquiaActualizada);
        } else {
            res.status(404).json({ error: 'Jerarquía no encontrada' });
        }
    } catch (err) {
        console.error('Error al actualizar la jerarquía:', err);
        res.status(500).json({ error: 'Error al actualizar la jerarquía', details: err });
    }
}

// Eliminar una jerarquía
async function deleteJerarquia(req, res) {
    const { id } = req.params;
    try {
        await sql.query(`
            DELETE FROM JerarquiaCuenta WHERE IdJerarquia = ${id}
        `);
        res.json({ message: 'Jerarquía eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la jerarquía', details: err });
    }
}

module.exports = { getJerarquia, createJerarquia, updateJerarquia, deleteJerarquia };
