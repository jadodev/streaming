import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

export class FFmpegStreamProcessorAdapter {
  private ffmpegProcesses: Map<string, ChildProcessWithoutNullStreams> = new Map();
  private readonly EXTERNAL_STORAGE_PATH = "D:\\hls_output";

  constructor() {
    if (!fs.existsSync(this.EXTERNAL_STORAGE_PATH)) {
      fs.mkdirSync(this.EXTERNAL_STORAGE_PATH, { recursive: true });
    }
  }

  start(sessionId: string): void {
    if (this.ffmpegProcesses.has(sessionId)) {
      console.warn(`El proceso FFmpeg para la sesión ${sessionId} ya está en ejecución.`);
      return;
    }

    const sessionOutputPath = path.join(this.EXTERNAL_STORAGE_PATH, sessionId);
    if (!fs.existsSync(sessionOutputPath)) {
      fs.mkdirSync(sessionOutputPath);
    }

    const outputPath = path.join(sessionOutputPath, "playlist.m3u8");

    const ffmpegProcess = spawn("ffmpeg", [
      "-f", "webm",
      "-i", "pipe:0",
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-c:a", "aac",
      "-f", "hls",
      "-hls_time", "4",
      "-hls_list_size", "6",
      "-hls_flags", "delete_segments",
      outputPath
    ]);

    this.ffmpegProcesses.set(sessionId, ffmpegProcess);

    ffmpegProcess.on("close", (code, signal) => {
      console.log(`FFmpeg finalizó para la sesión ${sessionId}. Código: ${code}, Señal: ${signal}`);
    });
    
    ffmpegProcess.on("error", (err) => {
      console.error(`Error en el proceso FFmpeg de la sesión ${sessionId}:`, err);
      this.cleanupSession(sessionId);
    });
    
    ffmpegProcess.stderr.on("data", (data) => {
      console.log(`FFmpeg stderr para sesión ${sessionId}:`, data.toString());
    });
  }

  writeFragment(sessionId: string, buffer: Buffer): void {
    const ffmpegProcess = this.ffmpegProcesses.get(sessionId);
    
    if (!ffmpegProcess) {
      console.warn(`No hay proceso FFmpeg activo para la sesión ${sessionId}`);
      return;
    }

  
    if (!ffmpegProcess.stdin.writable) {
      console.warn(`stdin no está disponible para la sesión ${sessionId}`);
      return;
    }
  
    try {
      console.log('¿stdin writable?', ffmpegProcess.stdin.writable);

      ffmpegProcess.stdin.write(buffer);
    } catch (err) {
      console.error(`Error escribiendo en stdin de FFmpeg para sesión ${sessionId}:`, (err as Error).message);
    }
  }

  async stop(sessionId: string): Promise<void> {
    await this.cleanupSession(sessionId);
  }

  private async cleanupSession(sessionId: string): Promise<void> {
    const ffmpegProcess = this.ffmpegProcesses.get(sessionId);
    if (ffmpegProcess) {
      ffmpegProcess.stdin.end();
      this.ffmpegProcesses.delete(sessionId);
    }

    // Eliminar archivos de la sesión después de 1 minuto (ajustable)
    setTimeout(async () => {
      try {
        const sessionPath = path.join(this.EXTERNAL_STORAGE_PATH, sessionId);
        await fsPromises.rm(sessionPath, { recursive: true, force: true });
        console.log(`Limpieza realizada para sesión ${sessionId}`);
      } catch (err) {
        console.error(`Error limpiando sesión ${sessionId}:`, err);
      }
    }, 60000); // 60 segundos para permitir finalización de procesos
  }
}
