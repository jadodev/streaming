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
exports.StreamController = void 0;
class StreamController {
    constructor(service) {
        this.service = service;
    }
    startStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const streamDto = yield this.service.startStream();
                res.status(201).json(streamDto);
            }
            catch (error) {
                console.error("Error al iniciar la transmisión:", error);
                res.status(500).json({ message: "Error al iniciar la transmisión" });
            }
        });
    }
    stopStream(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({ message: "Falta el ID de la transmisión" });
                    return;
                }
                const streamDto = yield this.service.stopStream(id);
                res.status(200).json(streamDto);
            }
            catch (error) {
                console.error("Error al detener la transmisión:", error);
                res.status(500).json({ message: "Error al detener la transmisión" });
            }
        });
    }
}
exports.StreamController = StreamController;
