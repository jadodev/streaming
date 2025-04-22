import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './src/infrastructure/route/VideoRoutes';
import routerStream from './src/infrastructure/route/StreamRoutes';

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use("/", routerStream);

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/videos';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

export default app;
