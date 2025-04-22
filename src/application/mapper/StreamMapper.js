"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamMapper = void 0;
const Stream_1 = require("../../domain/entity/Stream");
const StreamDto_1 = require("../dto/StreamDto");
class StreamMapper {
    static toDto(stream) {
        return new StreamDto_1.StreamDto(stream.getId(), stream.getStreamKey(), stream.getStatus(), stream.getStartedAt().toISOString(), `rtmp://localhost:1935/live/${stream.getStreamKey()}`);
    }
    static toDomain(dto) {
        const stream = new Stream_1.Stream(new Date(dto.startedAt));
        stream.assignId(dto.id);
        return stream;
    }
}
exports.StreamMapper = StreamMapper;
