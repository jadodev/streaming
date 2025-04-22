"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const VideoMapper_1 = require("../mapper/VideoMapper");
const VideoQueue_1 = require("../queue/VideoQueue");
const queue_1 = require("../../infrastructure/config/queue");
class VideoService {
    constructor(videoRepository, uploadDir) {
        this.videoRepository = videoRepository;
        this.uploadDir = uploadDir;
    }
    uploadVideo(filePath, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield VideoQueue_1.videoQueue.add('process-video', {
                filePath,
                uploadDir: this.uploadDir,
                metadata: dto
            });
            job.waitUntilFinished(queue_1.queueEvents).then((result) => {
                console.log(`El video ${dto.title} se ha procesado correctamente.`);
            }).catch((err) => {
                console.error(`Hubo un error al procesar el video: ${err.message}`);
            });
            return {
                id: 'pending',
                title: dto.title,
                description: dto.description || '',
                formats: [],
                thumbnailUrl: '',
                createdAt: new Date(),
                categories: dto.categories || [],
                tags: dto.tags || []
            };
        });
    }
    getVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield this.videoRepository.findAll();
            return videos.map(VideoMapper_1.VideoMapper.toResponseDTO);
        });
    }
    getVideoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.videoRepository.findById(id);
            return video ? VideoMapper_1.VideoMapper.toResponseDTO(video) : null;
        });
    }
    deleteVideo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.videoRepository.deleteById(id);
            // Opcional: eliminar archivos del storage simulado
        });
    }
}
exports.VideoService = VideoService;
