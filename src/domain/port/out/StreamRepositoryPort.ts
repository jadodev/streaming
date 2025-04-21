import { Stream } from "../../entity/Stream";

export interface StreamRepositoryPort {
    save(stream: Stream): Promise<Stream>;
    findById(id:string):Promise<Stream>;
}
