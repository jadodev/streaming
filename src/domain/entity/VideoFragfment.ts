export class VideoFragment {
    constructor(
        public readonly sessionId: string,
        public readonly buffer: Buffer,
        public readonly timestamp: Date,
    ){}
}