import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { VideoService } from '../../application/service/VideoService';
import { VideoController } from '../controller/VideoController';
import { FFmpegProcessor } from '../processor/FFmpgProcessor';
import { videoRepositoryImpl } from '../persistence/moongose/VideoRepository';

const router = Router();

// Configuración de Multer para manejar uploads (se guardan en la carpeta "uploads")
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
}); 
const upload = multer({ storage });

// Directorio donde se ubican los archivos procesados (se usa la misma carpeta "uploads")
const uploadDir = path.join(__dirname, '../../../uploads');

// Se instancia el procesador (implementación con FFmpeg)
const processor = new FFmpegProcessor();

// Se crea la instancia del servicio, inyectando el repositorio, el procesador y el directorio
const service = new VideoService(videoRepositoryImpl, uploadDir);

// Se instancia el controlador
const controller = new VideoController(service);

// Rutas definidas
router.post('/videos', upload.single('video'), (req, res) => controller.uploadVideo(req, res));
router.get('/videos', (req, res) => controller.getVideos(req, res));
router.get('/videos/:id', (req, res) => controller.getVideoById(req, res));
router.delete('/videos/:id', (req, res) => controller.deleteVideo(req, res));

export default router;
