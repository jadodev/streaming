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
exports.videoRepositoryImpl = void 0;
const Video_1 = require("../../../domain/entity/Video");
const VideoModel_1 = require("../moongose/VideoModel");
class VideoRepositoryImpl {
    save(video) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = new VideoModel_1.VideoModel({
                title: video.title,
                description: video.description,
                formats: video.formats,
                thumbnailUrl: video.thumbnailUrl,
                createdAt: video.createdAt,
                categories: video.categories,
                tags: video.tags
            });
            const saved = yield created.save();
            return new Video_1.Video(String(saved._id), saved.title, saved.description, saved.formats, saved.thumbnailUrl, saved.createdAt, saved.categories, saved.tags);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield VideoModel_1.VideoModel.find();
            return videos.map(v => new Video_1.Video(String(v._id), v.title, v.description, v.formats, v.thumbnailUrl, v.createdAt, v.categories, v.tags));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const v = yield VideoModel_1.VideoModel.findById(id);
            if (!v)
                return null;
            return new Video_1.Video(String(v._id), v.title, v.description, v.formats, v.thumbnailUrl, v.createdAt, v.categories, v.tags);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VideoModel_1.VideoModel.findByIdAndDelete(id);
        });
    }
}
exports.videoRepositoryImpl = new VideoRepositoryImpl();
