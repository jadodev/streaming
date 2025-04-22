"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const VideoRoutes_1 = __importDefault(require("./src/infrastructure/route/VideoRoutes"));
const StreamRoutes_1 = __importDefault(require("./src/infrastructure/route/StreamRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', VideoRoutes_1.default);
app.use("/", StreamRoutes_1.default);
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/videos';
mongoose_1.default.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error de conexión a MongoDB:', err));
exports.default = app;
