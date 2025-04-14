import { Redis } from 'ioredis';

const redisHost = '127.0.0.1';
const redisPort = 6379;

export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});
