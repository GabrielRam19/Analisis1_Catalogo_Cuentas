const sql = require('mssql');

const config = {
    user: 'admin',
    password: '1234',
    server: 'localhost',
    database: 'ContabilidadDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Conexión a la base de datos exitosa');
    } catch (err) {
        console.error('Error en la conexión a la base de datos:', err);
    }
}

module.exports = { sql, connectDB };