import { Request, Response } from 'express';
import { VideoUseCase } from '../../application/port/in/VideoUseCasePort';

export class VideoController {
  constructor(private videoUseCase: VideoUseCase) {}

  async uploadVideo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No se ha subido ningun archivo' });
        return;
      }

      const dto = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories ? JSON.parse(req.body.categories) : [],
        tags: req.body.tags ? JSON.parse(req.body.tags) : []
      };
      
      const responseDTO = await this.videoUseCase.uploadVideo(req.file.path, dto);
      res.status(201).json(responseDTO);
    } catch (error) {
      console.error('Error en uploadVideo:', error);
      res.status(500).json({ error: 'Error al subir video' });
    }
  }

  async getVideos(req: Request, res: Response): Promise<void> {
    try {
      const videos = await this.videoUseCase.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener videos' });
    }
  }

  async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const video = await this.videoUseCase.getVideoById(req.params.id);
      if (!video) {
        res.status(404).json({ error: 'Video no encontrado' });
      } else {
        res.json(video);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener video' });
    }
  }

  async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      await this.videoUseCase.deleteVideo(req.params.id);
      res.json({ message: 'Video eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar video' });
    }
  }
}
