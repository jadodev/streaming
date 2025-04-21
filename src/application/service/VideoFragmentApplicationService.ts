import { VideoFragmentRepositoryPort } from "../../domain/port/out/VideoFragmentPort";
import { VideoFragmentDto } from "../dto/VideoFragmentDto";
import { VideoFragmentMapper } from "../mapper/VideoFragmentMapper";

export class VideoFragmentApplicationService {
    constructor(
        private readonly repository: VideoFragmentRepositoryPort
    ){}

    async saveFragment(fragmentDto: VideoFragmentDto): Promise<void> {
        const fragment = VideoFragmentMapper.toDomain(fragmentDto);
        await this.repository.save(fragment);
    }

    async getFragmentsBySession(sessionId: string): Promise<VideoFragmentDto[]> {
        const fragments = await this.repository.findAllBySessionId(sessionId);
        return fragments.map(VideoFragmentMapper.toDto);
    }
}