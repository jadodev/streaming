"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEvents = void 0;
const bullmq_1 = require("bullmq");
const redisConnection_1 = require("./redisConnection");
exports.queueEvents = new bullmq_1.QueueEvents('video-processing', {
    connection: redisConnection_1.redisConnection
});
