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
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error MongoDB:', error));

app.get('/', (_req: Request, res: Response) => res.json({ message: 'Backend operativo' }));

// ============= AUTH ROUTES (Públicas) =============
app.post('/api/login', apiController.login);
app.post('/api/usuarios', apiController.create);

// ============= PERFIL (Usuario autenticado, cualquier rol) =============
app.patch('/api/perfil', authMiddleware, apiController.updatePerfil);
app.delete('/api/perfil', authMiddleware, apiController.eliminarCuenta);

// ============= USUARIO ROUTES (Protegidas) =============
app.get('/api/usuarios', authMiddleware, apiController.getAll);
app.get('/api/usuarios/:id/muestras', authMiddleware, apiController.getUserAndMuestras);
app.delete('/api/usuarios/:id', authMiddleware, requireRole(['admin']), apiController.deleteUser);

// ============= REGISTRO ROUTES (Protegidas) =============
app.get('/api/registros',  authMiddleware, apiController.listarRegistros);
app.post('/api/registros', authMiddleware, apiController.createRegistro);

// ============= ESPECTROMETRO ROUTES (Protegidas) =============
app.post('/api/espectrometros', authMiddleware, espectrometroController.crear);
app.get('/api/espectrometros', authMiddleware, espectrometroController.listar);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
