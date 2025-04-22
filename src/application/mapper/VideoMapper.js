"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMapper = void 0;
class VideoMapper {
    static toResponseDTO(video) {
        return {
            id: video.id,
            title: video.title,
            description: video.description,
            formats: video.formats,
            thumbnailUrl: video.thumbnailUrl,
            createdAt: video.createdAt,
            categories: video.categories,
            tags: video.tags
        };
    }
}
exports.VideoMapper = VideoMapper;
