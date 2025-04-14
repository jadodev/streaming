import { QueueEvents } from "bullmq";
import { redisConnection } from "./redisConnection";

export const queueEvents = new QueueEvents('video-processing', {
  connection: redisConnection
});
