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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegStreamProcessorAdapter = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
class FFmpegStreamProcessorAdapter {
    constructor() {
        this.ffmpegProcesses = new Map();
        this.EXTERNAL_STORAGE_PATH = "C:\\temp\\hls_output";
        if (!fs_1.default.existsSync(this.EXTERNAL_STORAGE_PATH)) {
            fs_1.default.mkdirSync(this.EXTERNAL_STORAGE_PATH, { recursive: true });
        }
    }
    start(sessionId) {
        if (this.ffmpegProcesses.has(sessionId)) {
            console.warn(`El proceso FFmpeg para la sesión ${sessionId} ya está en ejecución.`);
            return;
        }
        const sessionOutputPath = path_1.default.join(this.EXTERNAL_STORAGE_PATH, sessionId);
        if (!fs_1.default.existsSync(sessionOutputPath)) {
            fs_1.default.mkdirSync(sessionOutputPath);
        }
        const outputPath = path_1.default.join(sessionOutputPath, "playlist.m3u8");
        const ffmpegProcess = (0, child_process_1.spawn)("ffmpeg", [
            "-f", "flv",
            "-i", `rtmp://localhost:1935/live/${sessionId}`,
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-c:a", "aac",
            "-f", "hls",
            "-hls_time", "2",
            "-hls_list_size", "4",
            "-hls_flags", "delete_segments+split_by_time",
            "-hls_segment_type", "mpegts",
            "-hls_segment_filename", path_1.default.join(sessionOutputPath, "segment_%03d.ts"),
            outputPath
        ]);
        this.ffmpegProcesses.set(sessionId, ffmpegProcess);
        ffmpegProcess.on("close", (code, signal) => {
            console.log(`FFmpeg finalizó para la sesión ${sessionId}. Código: ${code}, Señal: ${signal}`);
        });
        ffmpegProcess.on("error", (err) => {
            console.error(`Error en el proceso FFmpeg de la sesión ${sessionId}:`, err);
            this.cleanupSession(sessionId);
        });
        ffmpegProcess.stderr.on("data", (data) => {
            console.log(`FFmpeg stderr para sesión ${sessionId}:`, data.toString());
        });
    }
    writeFragment(sessionId, buffer) {
        const ffmpegProcess = this.ffmpegProcesses.get(sessionId);
        if (!ffmpegProcess) {
            console.warn(`No hay proceso FFmpeg activo para la sesión ${sessionId}`);
            return;
        }
        if (!ffmpegProcess.stdin.writable) {
            console.warn(`stdin no está disponible para la sesión ${sessionId}`);
            return;
        }
        try {
            console.log('¿stdin writable?', ffmpegProcess.stdin.writable);
            ffmpegProcess.stdin.write(buffer);
        }
        catch (err) {
            console.error(`Error escribiendo en stdin de FFmpeg para sesión ${sessionId}:`, err.message);
        }
    }
    stop(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ffmpegProcess = this.ffmpegProcesses.get(sessionId);
            if (ffmpegProcess) {
                try {
                    ffmpegProcess.stdin.write('q\n');
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    if (!ffmpegProcess.killed) {
                        ffmpegProcess.kill('SIGTERM');
                    }
                }
                catch (err) {
                    console.error(`Error deteniendo FFmpeg: ${err}`);
                }
                finally {
                    this.ffmpegProcesses.delete(sessionId);
                }
            }
            yield this.cleanupSession(sessionId);
            console.log("Sesión terminada correctamente");
        });
    }
    cleanupSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ffmpegProcess = this.ffmpegProcesses.get(sessionId);
            if (ffmpegProcess) {
                ffmpegProcess.stdin.end();
                this.ffmpegProcesses.delete(sessionId);
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const sessionPath = path_1.default.join(this.EXTERNAL_STORAGE_PATH, sessionId);
                    yield promises_1.default.rm(sessionPath, { recursive: true, force: true });
                    console.log(`Limpieza realizada para sesión ${sessionId}`);
                }
                catch (err) {
                    console.error(`Error limpiando sesión ${sessionId}:`, err);
                }
            }), 6000);
        });
    }
}
exports.FFmpegStreamProcessorAdapter = FFmpegStreamProcessorAdapter;
