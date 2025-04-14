export class Video {
    constructor(
      public id: string | null,
      public title: string,
      public description: string,
      public formats: { resolution: string; url: string }[],
      public thumbnailUrl: string,
      public createdAt: Date = new Date(),
      public categories: string[] = [],
      public tags: string[] = []
    ) {}
  }
  