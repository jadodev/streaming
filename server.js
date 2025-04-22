"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const express_1 = __importDefault(require("express"));
const RTPMService_1 = require("./src/infrastructure/rtpm/RTPMService");
const RTMP_PORT = 1935;
const HTTP_STREAM_PORT = 8000;
const rtmpServer = new RTPMService_1.RTMPServer(RTMP_PORT, HTTP_STREAM_PORT);
app_1.default.use('/hls', express_1.default.static('C:\\temp\\hls_output'));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    rtmpServer.start();
});
