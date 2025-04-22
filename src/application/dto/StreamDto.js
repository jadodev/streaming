"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDto = void 0;
class StreamDto {
    constructor(id, streamKey, status, startedAt, rtmpUrl) {
        this.id = id;
        this.streamKey = streamKey;
        this.status = status;
        this.startedAt = startedAt;
        this.rtmpUrl = rtmpUrl;
    }
}
exports.StreamDto = StreamDto;
