import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // 1. Importamos mongoose

const app = express();
app.use(cors());
app.use(express.json());

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