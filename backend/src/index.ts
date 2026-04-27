import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import mongoose from 'mongoose'; // 1. Importamos mongoose
=======
import mongoose from 'mongoose';
import { ApiController } from './domain/apiGestion/http/controllers/api.controller';

>>>>>>> ramaVidal

const app = express();
const apiController = new ApiController();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// 2. Leemos la variable de entorno que configuramos en docker-compose
// Si por alguna razón no existe, usamos una ruta local por defecto
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';

// 3. Establecemos la conexión a la base de datos
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
  });
// Tu ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola desde el contenedor Docker del Backend! (Ahora con MongoDB)');
});
app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
=======
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_proyecto_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((error) => console.error('❌ Error MongoDB:', error));

// Rutas
app.get('/', (req, res) => res.send('Backend operativo'));

// ESTA ES LA RUTA QUE SALVA LOS DATOS

app.post('/api/login', (req, res) => apiController.login(req, res));

app.post('/api/usuarios', (req, res) => apiController.create(req, res));

app.get('/api/usuarios', (req, res) => apiController.getAll(req, res));

app.get('/api/usuarios/:id/muestras', (req, res) => apiController.getUserAndMuestras(req, res));

app.post('/api/registros', (req, res) => apiController.createRegistro(req, res));

app.delete('/api/usuarios/:id', (req, res) => apiController.deleteUser(req, res));


app.listen(3000, () => console.log('Servidor en puerto 3000'));
>>>>>>> ramaVidal
