import { Schema, model, Document } from 'mongoose';

export interface IVideoDocument extends Document {
  title: string;
  description: string;
  formats: { resolution: string; url: string }[];
  thumbnailUrl: string;
  createdAt: Date;
  categories: string[];
  tags: string[];
}

const VideoSchema = new Schema<IVideoDocument>({
  title: { type: String, required: true },
  description: { type: String },
  formats: [{
    resolution: { type: String, required: true },
    url: { type: String, required: true }
  }],
  thumbnailUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  categories: [{ type: String }],
  tags: [{ type: String }]
});

export const VideoModel = model<IVideoDocument>('Video', VideoSchema);
