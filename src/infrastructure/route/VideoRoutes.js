"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const VideoService_1 = require("../../application/service/VideoService");
const VideoController_1 = require("../controller/VideoController");
const VideoRepository_1 = require("../persistence/repository/VideoRepository");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../../uploads'));
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const uploadDir = path_1.default.join(__dirname, '../../../uploads');
const service = new VideoService_1.VideoService(VideoRepository_1.videoRepositoryImpl, uploadDir);
const controller = new VideoController_1.VideoController(service);
router.post('/videos', upload.single('video'), (req, res) => controller.uploadVideo(req, res));
router.get('/videos', (req, res) => controller.getVideos(req, res));
router.get('/videos/:id', (req, res) => controller.getVideoById(req, res));
router.delete('/videos/:id', (req, res) => controller.deleteVideo(req, res));
exports.default = router;
