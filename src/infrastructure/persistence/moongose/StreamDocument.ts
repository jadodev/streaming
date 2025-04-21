import mongoose, { Schema, Document } from "mongoose";

export interface StreamDocument extends Document {
  isRecording: boolean;
  startedAt: Date;
  stoppedAt?: Date | null;
}

const StreamSchema: Schema = new Schema({
  isRecording: { type: Boolean, required: true },
  startedAt: { type: Date, required: true },
  stoppedAt: { type: Date, default: null },
}, {
  timestamps: true,
});

export const StreamModel = mongoose.model<StreamDocument>("Stream", StreamSchema);
