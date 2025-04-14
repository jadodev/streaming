import { Video } from "../../domain/entity/Video";
import { VideoResponseDTO } from "../dto/VideoResponseDTO";

export class VideoMapper {
  static toResponseDTO(video: Video): VideoResponseDTO {
    return {
      id: video.id!,
      title: video.title,
      description: video.description,
      formats: video.formats,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
      categories: video.categories,
      tags:video.tags
    };
  }
}
