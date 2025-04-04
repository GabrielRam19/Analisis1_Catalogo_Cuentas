const { sql } = require('../database/db');

// Obtener todas las cuentas
async function getCuentas(req, res) {
    try {
        const result = await sql.query('SELECT * FROM CuentaContable');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las cuentas', details: err });
    }
}

async function createCuenta(req, res) {
    const { CodigoCuenta, NombreCuenta, TipoCuenta, Estado, IdGrupo } = req.body;
    try {
        await sql.query(`
            INSERT INTO CuentaContable (CodigoCuenta, NombreCuenta, TipoCuenta, Estado, IdGrupo)
            VALUES ('${CodigoCuenta}', '${NombreCuenta}', '${TipoCuenta}', '${Estado}', '${IdGrupo}')
        `);

        const result = await sql.query(`
            SELECT * FROM CuentaContable WHERE CodigoCuenta = '${CodigoCuenta}'
        `);

        const nuevaCuenta = result.recordset[0];

        try {
            await sql.query(`
                INSERT INTO AuditoriaCuenta (CodigoCuenta, Accion)
                VALUES ('${nuevaCuenta.CodigoCuenta}', 'Creación de cuenta')
            `);
        } catch (err) {
            console.error('Error al crear la auditoría:', err);
        }

        res.status(201).json(nuevaCuenta);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la cuenta', details: err });
    }
}

// Actualizar una cuenta existente
async function updateCuenta(req, res) {
    const { CodigoCuenta, NombreCuenta, TipoCuenta, Estado, IdGrupo } = req.body;
    try {
        await sql.query(`
            UPDATE CuentaContable
            SET NombreCuenta = '${NombreCuenta}', TipoCuenta = '${TipoCuenta}', Estado = '${Estado}', IdGrupo = '${IdGrupo}'
            WHERE CodigoCuenta = '${CodigoCuenta}'
        `);

        const result = await sql.query(`
            SELECT * FROM CuentaContable WHERE CodigoCuenta = '${CodigoCuenta}'
        `);

        if (result.recordset.length > 0) {
            const cuentaActualizada = result.recordset[0];

            try {
                // Insertar auditoría directamente
                await sql.query(`
                    INSERT INTO AuditoriaCuenta (CodigoCuenta, Accion)
                    VALUES ('${CodigoCuenta}', 'Actualización de cuenta')
                `);
            } catch (err) {
                console.error('Error al crear la auditoría:', err);
            }

            res.json(cuentaActualizada);
        } else {
            res.status(404).json({ error: 'Cuenta no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la cuenta', details: err });
    }
}

// Eliminar una cuenta
async function deleteCuenta(req, res) {
    const { CodigoCuenta } = req.params;
    try {
        const result = await sql.query(`
            DELETE FROM CuentaContable WHERE CodigoCuenta = '${CodigoCuenta}'
        `);
        res.json({ message: 'Cuenta eliminada exitosamente', data: result.recordset });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la cuenta', details: err });
    }
}

module.exports = { getCuentas, createCuenta, updateCuenta, deleteCuenta };