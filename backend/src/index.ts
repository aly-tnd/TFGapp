import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { apiController, espectrometroController } from './app.container';
import { errorHandler } from './shared/middleware/error.middleware';
import { authMiddleware, requireRole } from './shared/middleware/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexion MongoDB:', err));

app.get('/', (_req: Request, res: Response) => res.json({ message: 'Backend operativo' }));

// Rutas publicas
app.post('/api/login',    apiController.login);
app.post('/api/usuarios', apiController.create);

// Perfil del usuario autenticado
app.patch('/api/perfil',  authMiddleware, apiController.updatePerfil);
app.delete('/api/perfil', authMiddleware, apiController.eliminarCuenta);

// Registros del usuario autenticado
app.get('/api/mis-registros', authMiddleware, apiController.getMisRegistros);

// Usuarios (lectura requiere autenticacion)
app.get('/api/usuarios',                  authMiddleware, apiController.getAll);
app.get('/api/usuarios/:id/muestras',     authMiddleware, apiController.getUserAndMuestras);
app.delete('/api/usuarios/:id',           authMiddleware, requireRole(['admin']), apiController.deleteUser);

// Registros
app.get('/api/registros',  authMiddleware, requireRole(['admin']), apiController.listarRegistros);
app.post('/api/registros', authMiddleware, apiController.createRegistro);

// Espectrometros
app.post('/api/espectrometros', authMiddleware, espectrometroController.crear);
app.get('/api/espectrometros',  authMiddleware, espectrometroController.listar);

// Ediciones / observaciones de registros
app.post('/api/ediciones',                authMiddleware, apiController.createEdicion);
app.get('/api/ediciones/:registroId',     authMiddleware, apiController.getEdiciones);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
