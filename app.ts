import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import router from './src/infrastructure/route/VideoRoutes';
import routerStream from './src/infrastructure/route/StreamRoutes';
import { FileSystemVideoFragmentRepository } from './src/infrastructure/storage/s3SimulatorStream';
import { VideoFragmentApplicationService } from './src/application/service/VideoFragmentApplicationService';
import { FFmpegStreamProcessorAdapter } from './src/infrastructure/ffmpeg/FfmpeStreamProcessAdapter';
import { VideoFragmentWebSocketServer } from './src/infrastructure/websocket/VideoFragmentWebsocketServer';
import cors from 'cors';


const fragmentRepo = new FileSystemVideoFragmentRepository();
const fragmentService = new VideoFragmentApplicationService(fragmentRepo);
const ffmpegAdapter = new FFmpegStreamProcessorAdapter();

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use("/", routerStream);

new VideoFragmentWebSocketServer(8080, fragmentService, ffmpegAdapter);

const uploadsPath = path.resolve(__dirname, 'uploads');
console.log('Serving files from:', uploadsPath);
app.use('/storage', express.static(uploadsPath));

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/videos';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

export default app;
