import { Video } from "../../../domain/entity/Video";
import { VideoRepository } from "../../../domain/port/out/VideoRepositoryPort";
import { VideoModel } from "./VideoModel";

class VideoRepositoryImpl implements VideoRepository {
  
  async save(video: Video): Promise<Video> {
  
    const created = new VideoModel({
      title: video.title,
      description: video.description,
      formats: video.formats,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
      categories: video.categories,
      tags: video.tags
    });
  
    const saved = await created.save();
    return new Video(
      String(saved._id),
      saved.title,
      saved.description,
      saved.formats,
      saved.thumbnailUrl,
      saved.createdAt,
      saved.categories,
      saved.tags
    );
    
  }

  async findAll(): Promise<Video[]> {
    const videos = await VideoModel.find();
    return videos.map(v => new Video(
      String(v._id), 
      v.title,
      v.description,
      v.formats,
      v.thumbnailUrl,
      v.createdAt,
      v.categories,
      v.tags
    ));
  }

  async findById(id: string): Promise<Video | null> {
    const v = await VideoModel.findById(id);
    if (!v) return null;
    return new Video(
      String(v._id),  
      v.title,
      v.description,
      v.formats,
      v.thumbnailUrl,
      v.createdAt,
      v.categories,
      v.tags
    );
  }

  async deleteById(id: string): Promise<void> {
    await VideoModel.findByIdAndDelete(id);
  }
}

export const videoRepositoryImpl = new VideoRepositoryImpl();
