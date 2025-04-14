import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import router from './src/infrastructure/route/VideoRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para parsear JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', router);

// Ruta para acceder a archivos procesados simulando S3
const uploadsPath = path.resolve(__dirname, 'uploads');
console.log('Serving files from:', uploadsPath);
app.use('/storage', express.static(uploadsPath));

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/videos';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

export default app;
