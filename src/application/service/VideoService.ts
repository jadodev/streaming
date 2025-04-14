import { VideoUseCase } from '../port/in/VideoUseCasePort';
import { VideoRepository } from '../../domain/port/out/VideoRepositoryPort';
import { VideoUploadDTO } from '../dto/VideoUploadDTO';
import { VideoResponseDTO } from '../dto/VideoResponseDTO';
import { VideoMapper } from '../mapper/VideoMapper';
import { videoQueue } from '../queue/VideoQueue';
import { queueEvents } from '../../infrastructure/config/queue';

export class VideoService implements VideoUseCase {
  constructor(
    private videoRepository: VideoRepository,
    private uploadDir: string, 
  ) {}

  async uploadVideo(filePath: string, dto: VideoUploadDTO): Promise<VideoResponseDTO> {
    const job = await videoQueue.add('process-video', {
      filePath,
      uploadDir: this.uploadDir,
      metadata: dto
    });
  
    job.waitUntilFinished(queueEvents).then((result: any) => {
      console.log(`El video ${dto.title} se ha procesado correctamente.`);
    }).catch((err: any) => {
      console.error(`Hubo un error al procesar el video: ${err.message}`);
    });

    return {
      id: 'pending',
      title: dto.title,
      description: dto.description || '',
      formats: [],
      thumbnailUrl: '',
      createdAt: new Date(),
      categories: dto.categories || [],
      tags: dto.tags || []
    };
  }
  
  async getVideos(): Promise<VideoResponseDTO[]> {
    const videos = await this.videoRepository.findAll();
    return videos.map(VideoMapper.toResponseDTO);
  }

  async getVideoById(id: string): Promise<VideoResponseDTO | null> {
    const video = await this.videoRepository.findById(id);
    return video ? VideoMapper.toResponseDTO(video) : null;
  }

  async deleteVideo(id: string): Promise<void> {
    await this.videoRepository.deleteById(id);
    // Opcional: eliminar archivos del storage simulado
  }
}
