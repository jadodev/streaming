"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQueue = void 0;
const bullmq_1 = require("bullmq");
const redisConnection_1 = require("../../infrastructure/config/redisConnection");
exports.videoQueue = new bullmq_1.Queue('video-processing', {
    connection: redisConnection_1.redisConnection
});
