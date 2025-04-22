"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFragmentMapper = void 0;
const VideoFragfment_1 = require("../../domain/entity/VideoFragfment");
const VideoFragmentDto_1 = require("../dto/VideoFragmentDto");
class VideoFragmentMapper {
    static toDto(video) {
        return new VideoFragmentDto_1.VideoFragmentDto(video.sessionId, video.buffer, video.timestamp);
    }
    static toDomain(video) {
        return new VideoFragfment_1.VideoFragment(video.sessionId, video.buffer, video.timestamp);
    }
}
exports.VideoFragmentMapper = VideoFragmentMapper;
