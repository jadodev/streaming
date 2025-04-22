"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFragmentDto = void 0;
class VideoFragmentDto {
    constructor(sessionId, buffer, timestamp) {
        this.sessionId = sessionId;
        this.buffer = buffer;
        this.timestamp = timestamp;
    }
}
exports.VideoFragmentDto = VideoFragmentDto;
