const { sql } = require('../database/db');

// Obtener todos los grupos
async function getGrupos(req, res) {
    try {
        const result = await sql.query('SELECT * FROM GrupoCuenta');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los grupos', details: err });
    }
}

// Crear un nuevo grupo
async function createGrupo(req, res) {
    const { NombreGrupo, Descripcion } = req.body;
    try {
        const result = await sql.query(`
            INSERT INTO GrupoCuenta (NombreGrupo, Descripcion)
            OUTPUT INSERTED.IdGrupo, INSERTED.NombreGrupo, INSERTED.Descripcion
            VALUES ('${NombreGrupo}', '${Descripcion}')
        `);

        const nuevoGrupo = result.recordset[0];

        // Devolvemos el grupo con el IdGrupo generado
        res.status(201).json(nuevoGrupo);
    } catch (err) {
        console.error('Error al crear el grupo:', err);
        res.status(500).json({ error: 'Error al crear el grupo', details: err });
    }
}


// Actualizar un grupo
async function updateGrupo(req, res) {
    const { id } = req.params;
    const { NombreGrupo, Descripcion } = req.body;
    try {
        await sql.query(`
            UPDATE GrupoCuenta
            SET NombreGrupo = '${NombreGrupo}', Descripcion = '${Descripcion}'
            WHERE IdGrupo = ${id}
        `);

        const result = await sql.query(`
            SELECT * FROM GrupoCuenta WHERE IdGrupo = ${id}
        `);

        if (result.recordset.length > 0) {
            const grupoActualizado = result.recordset[0];
            res.json(grupoActualizado);
        } else {
            res.status(404).json({ error: 'Grupo no encontrado' });
        }
    } catch (err) {
        console.error('Error al actualizar el grupo:', err);
        res.status(500).json({ error: 'Error al actualizar el grupo', details: err });
    }
}

// Eliminar un grupo
async function deleteGrupo(req, res) {
    const { id } = req.params;
    try {
        await sql.query(`
            DELETE FROM GrupoCuenta WHERE IdGrupo = ${id}
        `);
        res.json({ message: 'Grupo eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el grupo', details: err });
    }
}

module.exports = { getGrupos, createGrupo, updateGrupo, deleteGrupo };
