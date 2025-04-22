import { Redis } from 'ioredis';

const redisHost = 'redis';
const redisPort = 6379;

export const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});
