"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegProcessor = void 0;
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
class FFmpegProcessor {
    constructor() {
        this.resolutions = [
            { label: '480p', size: '854x480' },
            { label: '720p', size: '1280x720' },
            { label: '1080p', size: '1920x1080' }
        ];
    }
    processVideo(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            const formats = [];
            let thumbnailPath = '';
            // Procesa cada resolución definida
            const processFormat = (res) => {
                return new Promise((resol, rej) => {
                    const outputFile = path_1.default.join(outputDir, `${Date.now()}_${res.label}.mp4`);
                    (0, fluent_ffmpeg_1.default)(inputPath)
                        .videoCodec('libx264')
                        .size(res.size)
                        .on('error', (err) => {
                        console.error(`Error procesando ${res.label}:`, err);
                        rej(err);
                    })
                        .on('end', () => {
                        formats.push({ resolution: res.label, filePath: outputFile });
                        resol();
                    })
                        .save(outputFile);
                });
            };
            const processAllFormats = Promise.all(this.resolutions.map(processFormat));
            // Genera la miniatura en el segundo 1 del video
            const processThumbnail = new Promise((resol, rej) => {
                const thumbnailFile = path_1.default.join(outputDir, `${Date.now()}_thumbnail.png`);
                (0, fluent_ffmpeg_1.default)(inputPath)
                    .screenshots({
                    count: 1,
                    timemarks: ['1'],
                    filename: path_1.default.basename(thumbnailFile),
                    folder: outputDir
                })
                    .on('end', () => {
                    thumbnailPath = thumbnailFile;
                    resol(thumbnailPath);
                })
                    .on('error', (err) => {
                    console.error('Error generando miniatura:', err);
                    rej(err);
                });
            });
            Promise.all([processAllFormats, processThumbnail])
                .then(() => {
                resolve({ formats, thumbnail: thumbnailPath });
            })
                .catch(reject);
        });
    }
}
exports.FFmpegProcessor = FFmpegProcessor;
