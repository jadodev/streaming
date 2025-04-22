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
const bullmq_1 = require("bullmq");
const redisConnection_1 = require("../config/redisConnection");
const FFmpgProcessor_1 = require("../processor/FFmpgProcessor");
const VideoRepository_1 = require("../persistence/repository/VideoRepository");
const s3Simulator_1 = require("../storage/s3Simulator");
const Video_1 = require("../../domain/entity/Video");
const moongose_1 = require("../config/moongose");
const processor = new FFmpgProcessor_1.FFmpegProcessor();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, moongose_1.connectToDatabase)();
    new bullmq_1.Worker('video-processing', (job) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { filePath, uploadDir, metadata } = job.data;
            const processed = yield processor.processVideo(filePath, uploadDir);
            const formatsUploaded = [];
            for (const format of processed.formats) {
                const url = yield (0, s3Simulator_1.uploadFile)(format.filePath);
                formatsUploaded.push({ resolution: format.resolution, url });
            }
            const thumbnailUrl = yield (0, s3Simulator_1.uploadFile)(processed.thumbnail);
            const video = new Video_1.Video(null, metadata.title, metadata.description || '', formatsUploaded, thumbnailUrl, new Date(), metadata.categories || [], metadata.tags || []);
            yield VideoRepository_1.videoRepositoryImpl.save(video);
            job.updateProgress(100);
            console.log(`✅ Video procesado y guardado: ${metadata.title}`);
        }
        catch (error) {
            console.error(`Error procesando el video: ${error}`);
            // const errorInstance = error instanceof Error ? error : new Error('Error desconocido');
            // job.moveToFailed(errorInstance, 'token');
        }
    }), { connection: redisConnection_1.redisConnection });
}))();
