import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ventasFile = path.join(__dirname, '../data/ventas.json');


function getVentas() {
  const data = fs.readFileSync(ventasFile, 'utf-8');
  return JSON.parse(data);
}

function saveVentas(data) {
  fs.writeFileSync(ventasFile, JSON.stringify(data, null, 2));
}


router.get('/', (req, res) => {
  res.json(getVentas());
});


router.get('/:id', (req, res) => {
  const ventas = getVentas();
  const venta = ventas.find(v => v.id == req.params.id);
  venta ? res.json(venta) : res.status(404).send("Venta no encontrada");
});


router.post('/', (req, res) => {
  const ventas = getVentas();
  const nuevaVenta = { ...req.body, id: Date.now() };
  ventas.push(nuevaVenta);
  saveVentas(ventas);
  res.status(201).json(nuevaVenta);
});


router.post('/buscar', (req, res) => {
  const ventas = getVentas();
  const resultado = ventas.filter(v => v.usuarioId == req.body.usuarioId);
  resultado.length > 0
    ? res.json(resultado)
    : res.status(404).send("No se encontraron ventas para ese usuario");
});


router.put('/:id', (req, res) => {
  const ventas = getVentas();
  const index = ventas.findIndex(v => v.id == req.params.id);
  if (index !== -1) {
    ventas[index] = { ...ventas[index], ...req.body };
    saveVentas(ventas);
    res.json(ventas[index]);
  } else {
    res.status(404).send("Venta no encontrada");
  }
});


router.delete('/:id', (req, res) => {
  const ventas = getVentas();
  const nuevasVentas = ventas.filter(v => v.id != req.params.id);
  if (nuevasVentas.length === ventas.length) {
    return res.status(404).send("Venta no encontrada");
  }
  saveVentas(nuevasVentas);
  res.send("Venta eliminada correctamente");
});

export default router;
