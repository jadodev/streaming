import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redisConnection';
import { FFmpegProcessor } from '../processor/FFmpgProcessor';
import { videoRepositoryImpl } from '../persistence/repository/VideoRepository';
import { uploadFile } from '../storage/s3Simulator';
import { Video } from '../../domain/entity/Video';
import { connectToDatabase } from '../config/moongose';

const processor = new FFmpegProcessor();

(async ()=> {
  await connectToDatabase();

  new Worker('video-processing', async (job: Job) => {
  try {
    const { filePath, uploadDir, metadata } = job.data;

    const processed = await processor.processVideo(filePath, uploadDir);

    const formatsUploaded = [];
    for (const format of processed.formats) {
      const url = await uploadFile(format.filePath);
      formatsUploaded.push({ resolution: format.resolution, url });
    }

    const thumbnailUrl = await uploadFile(processed.thumbnail);

    const video = new Video(
      null,
      metadata.title,
      metadata.description || '',
      formatsUploaded,
      thumbnailUrl,
      new Date(),
      metadata.categories || [],
      metadata.tags || []
    );

    await videoRepositoryImpl.save(video);

    job.updateProgress(100);
    console.log(`✅ Video procesado y guardado: ${metadata.title}`);

  } catch (error) {
    console.error(`Error procesando el video: ${error}`);
    // const errorInstance = error instanceof Error ? error : new Error('Error desconocido');
    // job.moveToFailed(errorInstance, 'token');
  }
}, { connection: redisConnection });
})();
