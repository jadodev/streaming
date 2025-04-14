import { VideoResponseDTO } from '../../dto/VideoResponseDTO';
import { VideoUploadDTO } from '../../dto/VideoUploadDTO';

export interface VideoUseCase {
  uploadVideo(filePath: string, dto: VideoUploadDTO): Promise<VideoResponseDTO>;
  getVideos(): Promise<VideoResponseDTO[]>;
  getVideoById(id: string): Promise<VideoResponseDTO | null>;
  deleteVideo(id: string): Promise<void>;
}
