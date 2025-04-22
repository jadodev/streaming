"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFragment = void 0;
class VideoFragment {
    constructor(sessionId, buffer, timestamp) {
        this.sessionId = sessionId;
        this.buffer = buffer;
        this.timestamp = timestamp;
    }
}
exports.VideoFragment = VideoFragment;
