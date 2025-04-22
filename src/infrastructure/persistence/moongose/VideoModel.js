"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModel = void 0;
const mongoose_1 = require("mongoose");
const VideoSchema = new mongoose_1.Schema({
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
exports.VideoModel = (0, mongoose_1.model)('Video', VideoSchema);
