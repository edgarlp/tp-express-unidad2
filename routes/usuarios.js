import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usuariosFile = path.join(__dirname, '../data/usuarios.json');
const ventasFile = path.join(__dirname, '../data/ventas.json');

function getUsuarios() {
  return JSON.parse(fs.readFileSync(usuariosFile));
}

function getVentas() {
  return JSON.parse(fs.readFileSync(ventasFile));
}

function saveUsuarios(data) {
  fs.writeFileSync(usuariosFile, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  res.json(getUsuarios());
});

router.get('/:id', (req, res) => {
  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.id == req.params.id);
  user ? res.json(user) : res.status(404).send("Usuario no encontrado");
});

router.post('/', (req, res) => {
  const usuarios = getUsuarios();
  const nuevo = req.body;
  nuevo.id = Date.now();
  usuarios.push(nuevo);
  saveUsuarios(usuarios);
  res.status(201).json(nuevo);
});

router.post('/buscar', (req, res) => {
  const usuarios = getUsuarios();
  const resultado = usuarios.find(u => u.email === req.body.email);
  resultado ? res.json(resultado) : res.status(404).send("No encontrado");
});

router.put('/:id', (req, res) => {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...req.body };
    saveUsuarios(usuarios);
    res.json(usuarios[index]);
  } else {
    res.status(404).send("Usuario no encontrado");
  }
});

router.delete('/:id', (req, res) => {
  const ventas = getVentas();
  const tieneVentas = ventas.some(v => v.usuarioId == req.params.id);
  if (tieneVentas) {
    res.status(400).send("No se puede eliminar. Tiene ventas asociadas.");
  } else {
    const usuarios = getUsuarios().filter(u => u.id != req.params.id);
    saveUsuarios(usuarios);
    res.send("Usuario eliminado.");
  }
});

export default router;
