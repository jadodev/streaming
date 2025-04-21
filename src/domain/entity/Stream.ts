export class Stream {
  private id?: string;
  private streamKey?: string;
  private isRecording: boolean;
  private startedAt: Date;
  private stoppedAt: Date | null;

  constructor(startedAt: Date) {
    this.startedAt = startedAt;
    this.isRecording = true;
    this.stoppedAt = null;
  }

  assignId(id: string) {
    this.id = id;
    this.streamKey = id;
  }

  stop() {
    this.isRecording = false;
    this.stoppedAt = new Date();
  }

  getId() {
    return this.id!;
  }

  getStreamKey() {
    return this.streamKey!;
  }

  getIsRecording() {
    return this.isRecording;
  }

  getStartedAt() {
    return this.startedAt;
  }

  getStoppedAt() {
    return this.stoppedAt;
  }

  getStatus(): "recording" | "stopped" {
    return this.isRecording ? "recording" : "stopped";
  }
}
