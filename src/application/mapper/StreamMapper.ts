import { Stream } from "../../domain/entity/Stream";
import { StreamDto } from "../dto/StreamDto";

export class StreamMapper {
    public static toDto(stream: Stream): StreamDto {
      return new StreamDto(
        stream.getId(),
        stream.getStreamKey(),
        stream.getStatus(),
        stream.getStartedAt().toISOString(),
        `rtmp://localhost:1935/live/${stream.getStreamKey()}`
      );
    }
  
    public static toDomain(dto: StreamDto): Stream {
      const stream = new Stream(new Date(dto.startedAt));
      stream.assignId(dto.id);
      return stream;
    }
  }
  