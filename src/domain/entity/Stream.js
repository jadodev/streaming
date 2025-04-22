"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
class Stream {
    constructor(startedAt) {
        this.startedAt = startedAt;
        this.isRecording = true;
        this.stoppedAt = null;
    }
    assignId(id) {
        this.id = id;
        this.streamKey = id;
    }
    stop() {
        this.isRecording = false;
        this.stoppedAt = new Date();
    }
    getId() {
        return this.id;
    }
    getStreamKey() {
        return this.streamKey;
    }
    getIsRecording() {
        return this.isRecording;
    }
    getStartedAt() {
        return this.startedAt;
    }
    getStoppedAt() {
        return this.stoppedAt;
    }
    getStatus() {
        return this.isRecording ? "recording" : "stopped";
    }
}
exports.Stream = Stream;
