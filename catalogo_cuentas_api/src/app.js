const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database/db');
const cuentaRoutes = require('./routes/cuentaRoutes');
const gruposRoutes = require('./routes/gruposRoutes');
const jerarquiaRoutes = require('./routes/jerarquiaRoutes');
const estadosRoutes = require('./routes/estadosRoutes');
const impuestosRoutes = require('./routes/impuestosRoutes');
const auditoriasRoutes = require('./routes/auditoriasRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', [cuentaRoutes, gruposRoutes, jerarquiaRoutes, estadosRoutes, impuestosRoutes, auditoriasRoutes]);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
