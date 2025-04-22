"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
const redisHost = 'localhost';
const redisPort = 6379;
exports.redisConnection = new ioredis_1.Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
});
