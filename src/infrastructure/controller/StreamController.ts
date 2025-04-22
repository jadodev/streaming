import { Request, Response } from "express";
import { StreamApplicationService } from "../../application/service/StreamApplicationService";

export class StreamController {
  constructor(private readonly service: StreamApplicationService) {}

  async startStream(req: Request, res: Response): Promise<void> {
    try {
      const streamDto = await this.service.startStream();
      res.status(201).json(streamDto);
    } catch (error) {
      console.error("Error al iniciar la transmisión:", error);
      res.status(500).json({ message: "Error al iniciar la transmisión" });
    }
  }

  async stopStream(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Falta el ID de la transmisión" });
        return;
      }

      const streamDto = await this.service.stopStream(id);
      res.status(200).json(streamDto);
    } catch (error) {
      console.error("Error al detener la transmisión:", error);
      res.status(500).json({ message: "Error al detener la transmisión" });
    }
  }
}