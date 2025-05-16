import express from 'express';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';
import productosRoutes from './routes/productos.js';
import ventasRoutes from './routes/ventas.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
