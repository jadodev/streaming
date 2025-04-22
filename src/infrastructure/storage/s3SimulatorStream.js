"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemVideoFragmentRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const VideoFragfment_1 = require("../../domain/entity/VideoFragfment");
// Promisificar las funciones de fs para usarlas con async/await
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const fileExists = (0, util_1.promisify)(fs_1.default.exists);
class FileSystemVideoFragmentRepository {
    constructor() {
        // Definir la ruta al directorio externo para metadatos
        this.basePath = path_1.default.resolve(__dirname, '../../../external-metadata');
        // Asegurarse de que el directorio exista, si no, crearlo
        if (!fs_1.default.existsSync(this.basePath)) {
            fs_1.default.mkdirSync(this.basePath, { recursive: true });
        }
    }
    getFilePath(sessionId) {
        return path_1.default.join(this.basePath, `${sessionId}.json`);
    }
    save(fragment) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.getFilePath(fragment.sessionId);
            let data = [];
            // Si el archivo ya existe, leerlo
            if (fs_1.default.existsSync(filePath)) {
                const raw = yield readFile(filePath, 'utf-8');
                data = JSON.parse(raw);
            }
            // Agregar el nuevo fragmento de video
            data.push({
                sessionId: fragment.sessionId,
                buffer: fragment.buffer.toString('base64'),
                timestamp: fragment.timestamp.toISOString()
            });
            // Guardar los datos en el archivo en el directorio externo
            yield writeFile(filePath, JSON.stringify(data, null, 2));
        });
    }
    findAllBySessionId(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.getFilePath(sessionId);
            // Si no existe el archivo de metadatos, devolver un array vacío
            if (!fs_1.default.existsSync(filePath))
                return [];
            // Leer los metadatos del archivo
            const raw = yield readFile(filePath, 'utf-8');
            const data = JSON.parse(raw);
            // Convertir los datos a objetos VideoFragment
            return data.map((item) => new VideoFragfment_1.VideoFragment(item.sessionId, Buffer.from(item.buffer, 'base64'), new Date(item.timestamp)));
        });
    }
}
exports.FileSystemVideoFragmentRepository = FileSystemVideoFragmentRepository;
