const { sql } = require('../database/db'); // Asumiendo que tienes una conexión de base de datos configurada

// Obtener todos los impuestos
async function getImpuestos(req, res) {
    try {
        const result = await sql.query(`
            SELECT ic.IdImpuesto, ic.CodigoCuenta, ic.Porcentaje, ic.TipoImpuesto, cc.NombreCuenta
            FROM ImpuestoCuenta ic
            INNER JOIN CuentaContable cc ON ic.CodigoCuenta = cc.CodigoCuenta
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener los impuestos:", err);
        res.status(500).json({ error: "Error al obtener los impuestos", details: err });
    }
}

// Crear un nuevo impuesto
async function createImpuesto(req, res) {
    const { CodigoCuenta, Porcentaje, TipoImpuesto } = req.body;
    try {
        const result = await sql.query(`
            INSERT INTO ImpuestoCuenta (CodigoCuenta, Porcentaje, TipoImpuesto)
            OUTPUT INSERTED.IdImpuesto, INSERTED.CodigoCuenta, INSERTED.Porcentaje, INSERTED.TipoImpuesto
            VALUES ('${CodigoCuenta}', ${Porcentaje}, '${TipoImpuesto}')
        `);

        const nuevoImpuesto = result.recordset[0];
        // Se devuelve el nuevo impuesto con el IdImpuesto generado
        res.status(201).json(nuevoImpuesto);
    } catch (err) {
        console.error("Error al crear el impuesto:", err);
        res.status(500).json({ error: "Error al crear el impuesto", details: err });
    }
}

// Actualizar un impuesto existente
async function updateImpuesto(req, res) {
    const { id } = req.params;
    const { CodigoCuenta, Porcentaje, TipoImpuesto } = req.body;
    try {
        await sql.query(`
            UPDATE ImpuestoCuenta
            SET CodigoCuenta = '${CodigoCuenta}', Porcentaje = ${Porcentaje}, TipoImpuesto = '${TipoImpuesto}'
            WHERE IdImpuesto = ${id}
        `);

        const result = await sql.query(`
            SELECT * FROM ImpuestoCuenta WHERE IdImpuesto = ${id}
        `);

        if (result.recordset.length > 0) {
            const impuestoActualizado = result.recordset[0];
            // Se devuelve el impuesto actualizado
            res.json(impuestoActualizado);
        } else {
            res.status(404).json({ error: 'Impuesto no encontrado' });
        }
    } catch (err) {
        console.error("Error al actualizar el impuesto:", err);
        res.status(500).json({ error: "Error al actualizar el impuesto", details: err });
    }
}

// Eliminar un impuesto
async function deleteImpuesto(req, res) {
    const { id } = req.params;
    try {
        await sql.query(`
            DELETE FROM ImpuestoCuenta WHERE IdImpuesto = ${id}
        `);
        res.json({ message: "Impuesto eliminado exitosamente" });
    } catch (err) {
        console.error("Error al eliminar el impuesto:", err);
        res.status(500).json({ error: "Error al eliminar el impuesto", details: err });
    }
}

module.exports = { getImpuestos, createImpuesto, updateImpuesto, deleteImpuesto };
