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
exports.StreamApplicationService = void 0;
const StreamMapper_1 = require("../mapper/StreamMapper");
const Stream_1 = require("../../domain/entity/Stream");
class StreamApplicationService {
    constructor(service, ffmpegAdapter) {
        this.service = service;
        this.ffmpegAdapter = ffmpegAdapter;
    }
    startStream() {
        return __awaiter(this, void 0, void 0, function* () {
            const newStream = new Stream_1.Stream(new Date());
            const startedStream = yield this.service.startStreamSession(newStream);
            yield this.ffmpegAdapter.start(startedStream.getId());
            console.log("****************************");
            console.log("*    Transmisión iniciada  *");
            console.log("****************************");
            return StreamMapper_1.StreamMapper.toDto(startedStream);
        });
    }
    stopStream(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield this.service.stopStreamSession(id);
            yield this.ffmpegAdapter.stop(id);
            console.log("****************************");
            console.log("*    Transmisión detenida  *");
            console.log("****************************");
            return StreamMapper_1.StreamMapper.toDto(stream);
        });
    }
}
exports.StreamApplicationService = StreamApplicationService;
