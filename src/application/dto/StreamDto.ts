export class StreamDto {
    constructor(
        public readonly id: string,
        public readonly streamKey: string,
        public readonly status: string,
        public readonly startedAt: string
    ) {}
}
