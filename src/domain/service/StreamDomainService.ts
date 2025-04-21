import { Stream } from "../entity/Stream";
import { StreamSession } from "../port/in/StreamSession";
import { StreamRepositoryPort } from "../port/out/StreamRepositoryPort";

export class StreamDomainService implements StreamSession{
    constructor(
        private readonly repository: StreamRepositoryPort
    ){}

    async startStreamSession( stream: Stream ): Promise<Stream> {
        const save = await this.repository.save(stream);
        return save;
    }

    async stopStreamSession( id: string): Promise<Stream> {
        const stream = await this.repository.findById(id);
        stream.stop();
        await this.repository.save(stream);
        return stream;
    }
}