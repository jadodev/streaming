import WebSocket, { WebSocketServer } from "ws";
import { VideoFragmentApplicationService } from "../../application/service/VideoFragmentApplicationService";
import { VideoFragmentDto } from "../../application/dto/VideoFragmentDto";
import { FFmpegStreamProcessorAdapter } from "../ffmpeg/FfmpeStreamProcessAdapter";
import { parse } from "url";

export class VideoFragmentWebSocketServer {
  private wss: WebSocketServer;

  constructor(
    port: number,
    private readonly fragmentService: VideoFragmentApplicationService,
    private readonly ffmpegAdapter: FFmpegStreamProcessorAdapter
  ) {
    this.wss = new WebSocketServer({ port });
    this.setupListeners();
    console.log(`WebSocket Server listening on port ${port}`);
  }

  private setupListeners(): void {
    this.wss.on("connection", (ws: WebSocket, req) => {
      const url = parse(req.url || "", true);
      const sessionId = url.query.sessionId?.toString();

      if (!sessionId) {
        return;
      }

      console.log(`📡 Nueva conexión WebSocket para sesión: ${sessionId}`);

      this.ffmpegAdapter.start(sessionId);

      ws.on("message", async (message: WebSocket.RawData) => {
        try {
          const buffer = Buffer.isBuffer(message) ? message : Buffer.from(message as ArrayBuffer);
          console.log("-------------------------------------")
          console.log(buffer)
          console.log("-------------------------------------")
          const fragmentDto = new VideoFragmentDto(sessionId, buffer, new Date());
          console.log(fragmentDto);
          await this.fragmentService.saveFragment(fragmentDto);

          this.ffmpegAdapter.writeFragment(sessionId, buffer);
        } catch (err) {
          console.error("❌ Error procesando fragmento binario:", err);
        }
      });

      ws.on('close', (code, reason) => {
        console.warn(`🔴 WebSocket cerrado inesperadamente para sesión ${sessionId}. Código: ${code}, Razón: ${reason?.toString()}`);
      });
      
      ws.on('error', (err) => {
        console.error(`⚠️ Error en WebSocket sesión ${sessionId}:`, err);
      });
      
      ws.on('message', (data) => {
        console.log(`📩 Recibido fragmento de ${data.byteLength || data.length} bytes para sesión ${sessionId}`);
      });
    });
  }
}

