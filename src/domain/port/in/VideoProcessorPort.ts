export interface ProcessedVideo {
  formats: { resolution: string; filePath: string }[];
  thumbnail: string;
}
  
export interface VideoProcessor {
  processVideo(inputPath: string, outputDir: string): Promise<ProcessedVideo>;
}
  