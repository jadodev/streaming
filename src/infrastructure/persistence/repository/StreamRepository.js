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
exports.StreamRepository = void 0;
const Stream_1 = require("../../../domain/entity/Stream");
const StreamDocument_1 = require("../moongose/StreamDocument");
class StreamRepository {
    save(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const streamDoc = new StreamDocument_1.StreamModel({
                isRecording: stream.getIsRecording(),
                startedAt: stream.getStartedAt(),
                stoppedAt: stream.getStoppedAt(),
            });
            const saved = yield streamDoc.save();
            stream.assignId(saved.id.toString());
            return stream;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield StreamDocument_1.StreamModel.findById(id).exec();
            if (!found)
                throw new Error(`Stream con id ${id} no encontrado`);
            const stream = new Stream_1.Stream(found.startedAt);
            stream.assignId(found.id.toString());
            if (!found.isRecording) {
                stream.stop();
            }
            return stream;
        });
    }
}
exports.StreamRepository = StreamRepository;
