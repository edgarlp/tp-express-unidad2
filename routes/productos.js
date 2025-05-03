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

router.get('/', (req, res) => {
  const productos = getProductos();
  res.json(productos);
});

export default router;
