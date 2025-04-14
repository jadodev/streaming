export interface VideoResponseDTO {
  id: string;
  title: string;
  description?: string;
  formats: { resolution: string; url: string }[];
  thumbnailUrl: string;
  createdAt: Date;
  categories: string[];
  tags: string[];
}
  