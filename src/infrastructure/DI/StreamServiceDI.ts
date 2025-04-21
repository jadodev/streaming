import { StreamRepository } from '../persistence/repository/StreamRepository';
import { StreamDomainService } from '../../domain/service/StreamDomainService';
import { StreamApplicationService } from '../../application/service/StreamApplicationService';
import { FFmpegStreamProcessorAdapter } from '../ffmpeg/FFmpegStreamProcessorAdapter';

const ffmpegAdapter = new FFmpegStreamProcessorAdapter();
const repository = new StreamRepository();
const domainService = new StreamDomainService(repository);
const streamService = new StreamApplicationService(domainService, ffmpegAdapter);

export { streamService };
