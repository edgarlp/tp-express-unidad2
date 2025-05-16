import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const productosFile = path.join(__dirname, '../data/productos.json');

function getProductos() {
  const data = fs.readFileSync(productosFile, 'utf-8');
  const productos = JSON.parse(data);
  console.log("📦 Productos cargados:", productos);
  return productos;
}

function saveProductos(data) {
  fs.writeFileSync(productosFile, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const productos = getProductos();
  res.json(productos);
});

router.get('/:id', (req, res) => {
  const productos = getProductos();
  const producto = productos.find(p => p.id == req.params.id);
  producto ? res.json(producto) : res.status(404).send("Producto no encontrado");
});

router.post('/', (req, res) => {
  const productos = getProductos();
  const nuevo = req.body;
  nuevo.id = Date.now();
  productos.push(nuevo);
  saveProductos(productos);
  res.status(201).json(nuevo);
});

router.post('/buscar', (req, res) => {
  const productos = getProductos();
  const nombreBuscado = req.body.nombre?.toLowerCase();
  const resultado = productos.filter(p => p.nombre.toLowerCase().includes(nombreBuscado));
  resultado.length > 0
    ? res.json(resultado)
    : res.status(404).send("No se encontró ningún producto con ese nombre");
});

router.put('/:id', (req, res) => {
  const productos = getProductos();
  const index = productos.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body };
    saveProductos(productos);
    res.json(productos[index]);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

router.delete('/:id', (req, res) => {
  const productos = getProductos();
  const restantes = productos.filter(p => p.id != req.params.id);
  if (restantes.length === productos.length) {
    return res.status(404).send("Producto no encontrado");
  }
  saveProductos(restantes);
  res.send("Producto eliminado");
});

export default router;
