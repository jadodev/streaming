import { StreamDomainService } from "../../domain/service/StreamDomainService";
import { StreamDto } from "../dto/StreamDto";
import { StreamMapper } from "../mapper/StreamMapper";
import { Stream } from "../../domain/entity/Stream";
import { FFmpegStreamProcessorAdapter } from "../../infrastructure/ffmpeg/FfmpeStreamProcessAdapter";

export class StreamApplicationService {
  constructor(
    private readonly service: StreamDomainService,
    private readonly ffmpegAdapter: FFmpegStreamProcessorAdapter
  ) {}

  async startStream(): Promise<StreamDto> {
    const newStream = new Stream(new Date());
    const startedStream = await this.service.startStreamSession(newStream);

    await this.ffmpegAdapter.start(startedStream.getId());

    console.log("****************************");
    console.log("*    Transmisión iniciada  *");
    console.log("****************************");

    return StreamMapper.toDto(startedStream);
  }

  async stopStream(id: string): Promise<StreamDto> {
    const stream = await this.service.stopStreamSession(id);

    await this.ffmpegAdapter.stop(id);

    console.log("****************************");
    console.log("*    Transmisión detenida  *");
    console.log("****************************");

    return StreamMapper.toDto(stream);
  }
}
