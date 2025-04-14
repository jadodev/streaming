import path from 'path';
import { ProcessedVideo, VideoProcessor } from '../../domain/port/in/VideoProcessorPort';
import ffmpeg from 'fluent-ffmpeg';

export class FFmpegProcessor implements VideoProcessor {
  private resolutions = [
    { label: '480p', size: '854x480' },
    { label: '720p', size: '1280x720' },
    { label: '1080p', size: '1920x1080' }
  ];

  processVideo(inputPath: string, outputDir: string): Promise<ProcessedVideo> {
    return new Promise((resolve, reject) => {
      const formats: { resolution: string; filePath: string }[] = [];
      let thumbnailPath = '';

      // Procesa cada resolución definida
      const processFormat = (res: { label: string; size: string }): Promise<void> => {
        return new Promise((resol, rej) => {
          const outputFile = path.join(outputDir, `${Date.now()}_${res.label}.mp4`);
          ffmpeg(inputPath)
            .videoCodec('libx264')
            .size(res.size)
            .on('error', (err: any) => {
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

      const processAllFormats = Promise.all(
        this.resolutions.map(processFormat)
      );

      // Genera la miniatura en el segundo 1 del video
      const processThumbnail = new Promise<string>((resol, rej) => {
        const thumbnailFile = path.join(outputDir, `${Date.now()}_thumbnail.png`);
        ffmpeg(inputPath)
          .screenshots({
            count: 1,
            timemarks: ['1'],
            filename: path.basename(thumbnailFile),
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
