import { Queue } from 'bullmq';
import { VideoProcessingJobData } from './VideoJobTypes';
import { redisConnection } from '../../infrastructure/config/redisConnection';

export const videoQueue = new Queue<VideoProcessingJobData>('video-processing', {
  connection: redisConnection
});
