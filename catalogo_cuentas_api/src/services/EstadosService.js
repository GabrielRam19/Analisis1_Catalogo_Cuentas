const { sql } = require('../database/db'); // Asumiendo que tienes una conexión de base de datos configurada

// Obtener todos los estados financieros
async function getEstadosFinancieros(req, res) {
    try {
        const result = await sql.query(`
            SELECT ef.IdEstadoFinanciero, ef.CodigoCuenta, ef.TipoEstado, cc.NombreCuenta
            FROM EstadoFinanciero ef
            INNER JOIN CuentaContable cc ON ef.CodigoCuenta = cc.CodigoCuenta
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener los estados financieros:", err);
        res.status(500).json({ error: "Error al obtener los estados financieros", details: err });
    }
}


// Crear un nuevo estado financiero
async function createEstadoFinanciero(req, res) {
    const { CodigoCuenta, TipoEstado } = req.body;
    try {
        const result = await sql.query(`
            INSERT INTO EstadoFinanciero (CodigoCuenta, TipoEstado)
            OUTPUT INSERTED.IdEstadoFinanciero, INSERTED.CodigoCuenta, INSERTED.TipoEstado
            VALUES ('${CodigoCuenta}', '${TipoEstado}')
        `);

        const nuevoEstado = result.recordset[0];
        res.status(201).json(nuevoEstado);
    } catch (err) {
        console.error("Error al crear el estado financiero:", err);
        res.status(500).json({ error: "Error al crear el estado financiero", details: err });
    }
}

// Actualizar un estado financiero existente
async function updateEstadoFinanciero(req, res) {
    const { id } = req.params;
    const { CodigoCuenta, TipoEstado } = req.body;
    try {
        await sql.query(`
            UPDATE EstadoFinanciero
            SET CodigoCuenta = '${CodigoCuenta}', TipoEstado = '${TipoEstado}'
            WHERE IdEstadoFinanciero = ${id}
        `);

        const result = await sql.query(`
            SELECT * FROM EstadoFinanciero WHERE IdEstadoFinanciero = ${id}
        `);

        if (result.recordset.length > 0) {
            const estadoActualizado = result.recordset[0];
            res.json(estadoActualizado);
        } else {
            res.status(404).json({ error: 'Estado financiero no encontrado' });
        }
    } catch (err) {
        console.error("Error al actualizar el estado financiero:", err);
        res.status(500).json({ error: "Error al actualizar el estado financiero", details: err });
    }
}

// Eliminar un estado financiero
async function deleteEstadoFinanciero(req, res) {
    const { id } = req.params;
    try {
        await sql.query(`
            DELETE FROM EstadoFinanciero WHERE IdEstadoFinanciero = ${id}
        `);
        res.json({ message: "Estado financiero eliminado exitosamente" });
    } catch (err) {
        console.error("Error al eliminar el estado financiero:", err);
        res.status(500).json({ error: "Error al eliminar el estado financiero", details: err });
    }
}

module.exports = { getEstadosFinancieros, createEstadoFinanciero, updateEstadoFinanciero, deleteEstadoFinanciero };
