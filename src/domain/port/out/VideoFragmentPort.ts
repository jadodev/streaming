import { VideoFragment } from "../../entity/VideoFragfment";

export interface VideoFragmentRepositoryPort {
        save(fragment: VideoFragment): Promise<void>;
        findAllBySessionId(sessionId: string): Promise<VideoFragment[]>;
} 
