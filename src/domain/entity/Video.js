"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
class Video {
    constructor(id, title, description, formats, thumbnailUrl, createdAt = new Date(), categories = [], tags = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.formats = formats;
        this.thumbnailUrl = thumbnailUrl;
        this.createdAt = createdAt;
        this.categories = categories;
        this.tags = tags;
    }
}
exports.Video = Video;
