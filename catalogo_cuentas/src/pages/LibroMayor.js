import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material';

function LibroMayor() {
  const [cuentas, setCuentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Fetch datos del libro mayor
  const fetchLibroMayor = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/libro-mayor?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      const data = await response.json();
      setCuentas(data);
    } catch (error) {
      console.error('Error al obtener el libro mayor:', error);
      alert('Error al obtener los datos');
    }
  };

  // Manejo de búsqueda por fecha
  const handleBuscar = () => {
    if (fechaInicio && fechaFin) {
      fetchLibroMayor();
    } else {
      alert('Por favor, ingrese un periodo válido.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Libro Mayor
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4} display="flex" alignItems="flex-end">
          <Button variant="contained" color="primary" onClick={handleBuscar}>
            Buscar
          </Button>
        </Grid>
      </Grid>

      {cuentas.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: 4 }}>
          No hay datos disponibles.
        </Typography>
      ) : (
        cuentas.map((cuenta, idx) => (
          <Box key={idx} sx={{ marginTop: 4 }}>
            <Typography variant="h6" gutterBottom>
              Código de Cuenta: {cuenta.CodigoCuenta}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Debe</TableCell>
                    <TableCell>Haber</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cuenta.movimientos.map((mov, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(mov.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>{mov.debe.toFixed(2)}</TableCell>
                      <TableCell>{mov.haber.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <strong>Saldo:</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{cuenta.saldo.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ marginY: 3 }} />
          </Box>
        ))
      )}
    </Box>
  );
}

export default LibroMayor;
