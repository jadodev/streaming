import { VideoFragment } from "../../domain/entity/VideoFragfment";
import { VideoFragmentDto } from "../dto/VideoFragmentDto";

export class VideoFragmentMapper {
    public static toDto(video:VideoFragment): VideoFragmentDto {
        return new VideoFragmentDto(
            video.sessionId,
            video.buffer,
            video.timestamp
        )
    }

    public static toDomain(video: VideoFragmentDto): VideoFragment{
        return new VideoFragment(
            video.sessionId,
            video.buffer,
            video.timestamp
        )
    }
}