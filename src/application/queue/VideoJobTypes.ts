export interface VideoProcessingJobData {
    filePath: string;
    uploadDir: string;
    metadata: {
      title: string;
      description?: string;
      categories?: string[];
      tags?: string[];
    };
  }
  
  