"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storagePath = path_1.default.join(__dirname, '../../../storage.json');
const uploadFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(storagePath, 'utf8', (err, data) => {
            let storage = {};
            if (!err) {
                try {
                    storage = JSON.parse(data);
                }
                catch (e) {
                    console.error('Error parseando storage.json:', e);
                }
            }
            const key = path_1.default.basename(filePath);
            // Simula una URL pública para el archivo
            const simulatedUrl = `http://localhost:3000/storage/${key}`;
            storage[key] = simulatedUrl;
            fs_1.default.writeFile(storagePath, JSON.stringify(storage, null, 2), (writeErr) => {
                if (writeErr)
                    return reject(writeErr);
                resolve(simulatedUrl);
            });
        });
    });
};
exports.uploadFile = uploadFile;
