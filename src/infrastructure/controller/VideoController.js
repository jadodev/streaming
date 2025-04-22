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
exports.VideoController = void 0;
class VideoController {
    constructor(videoUseCase) {
        this.videoUseCase = videoUseCase;
    }
    uploadVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No se ha subido ningun archivo' });
                    return;
                }
                const dto = {
                    title: req.body.title,
                    description: req.body.description,
                    categories: req.body.categories ? JSON.parse(req.body.categories) : [],
                    tags: req.body.tags ? JSON.parse(req.body.tags) : []
                };
                const responseDTO = yield this.videoUseCase.uploadVideo(req.file.path, dto);
                res.status(201).json(responseDTO);
            }
            catch (error) {
                console.error('Error en uploadVideo:', error);
                res.status(500).json({ error: 'Error al subir video' });
            }
        });
    }
    getVideos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videos = yield this.videoUseCase.getVideos();
                res.json(videos);
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener videos' });
            }
        });
    }
    getVideoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield this.videoUseCase.getVideoById(req.params.id);
                if (!video) {
                    res.status(404).json({ error: 'Video no encontrado' });
                }
                else {
                    res.json(video);
                }
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener video' });
            }
        });
    }
    deleteVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.videoUseCase.deleteVideo(req.params.id);
                res.json({ message: 'Video eliminado correctamente' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error al eliminar video' });
            }
        });
    }
}
exports.VideoController = VideoController;
