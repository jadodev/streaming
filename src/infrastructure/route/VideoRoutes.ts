import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { VideoService } from '../../application/service/VideoService';
import { VideoController } from '../controller/VideoController';
import { videoRepositoryImpl } from '../persistence/repository/VideoRepository';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
}); 
const upload = multer({ storage });
const uploadDir = path.join(__dirname, '../../../uploads');

const service = new VideoService(videoRepositoryImpl, uploadDir);
const controller = new VideoController(service);

router.post('/videos', upload.single('video'), (req, res) => controller.uploadVideo(req, res));
router.get('/videos', (req, res) => controller.getVideos(req, res));
router.get('/videos/:id', (req, res) => controller.getVideoById(req, res));
router.delete('/videos/:id', (req, res) => controller.deleteVideo(req, res));

export default router;
