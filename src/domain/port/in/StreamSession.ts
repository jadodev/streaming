import { Stream } from "../../entity/Stream";

export interface StreamSession {
    startStreamSession( stream: Stream ):Promise<Stream>;
    stopStreamSession(id: string ):Promise<Stream>;
}