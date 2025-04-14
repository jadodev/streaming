import { VideoUseCase } from '../port/in/VideoUseCasePort';
import { VideoRepository } from '../../domain/port/out/VideoRepositoryPort';
import { VideoProcessor } from '../../domain/port/in/VideoProcessorPort';
import { VideoUploadDTO } from '../dto/VideoUploadDTO';
import { VideoResponseDTO } from '../dto/VideoResponseDTO';
import { Video } from '../../domain/entity/Video';
import { VideoMapper } from '../mapper/VideoMapper';
import { uploadFile } from '../../infrastructure/storage/s3Simulator';

export class VideoService implements VideoUseCase {
  constructor(
    private videoRepository: VideoRepository,
    private videoProcessor: VideoProcessor,
    private uploadDir: string // Directorio donde se guardarán los videos procesados
  ) {}

  async uploadVideo(filePath: string, dto: VideoUploadDTO): Promise<VideoResponseDTO> {
    // Se procesa el video (transcodificación y generación de miniatura)
    const processed = await this.videoProcessor.processVideo(filePath, this.uploadDir);

    // Se simula la subida a S3 obteniendo URL para cada formato y la miniatura
    const formatsUploaded = [];
    for (const format of processed.formats) {
      const url = await uploadFile(format.filePath);
      formatsUploaded.push({ resolution: format.resolution, url });
    }
    const thumbnailUrl = await uploadFile(processed.thumbnail);

    // Se crea la entidad de dominio Video (sin id; este se asignará en la persistencia)
    const video = new Video(
      null,
      dto.title,
      dto.description || '',
      formatsUploaded,
      thumbnailUrl,
      new Date(),
      dto.categories || [],
      dto.tags || []
    );

    // Se guarda en el repositorio (MongoDB)
    const savedVideo = await this.videoRepository.save(video);

    // Se retorna el DTO de respuesta
    return VideoMapper.toResponseDTO(savedVideo);
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
