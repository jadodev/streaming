import { Video } from "../../entity/Video";

export interface VideoRepository {
  save(video: Video): Promise<Video>;
  findAll(): Promise<Video[]>;
  findById(id: string): Promise<Video | null>;
  deleteById(id: string): Promise<void>;
}
