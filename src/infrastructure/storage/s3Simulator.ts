import fs from 'fs';
import path from 'path';

const storagePath = path.join(__dirname, '../../../storage.json');

export const uploadFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(storagePath, 'utf8', (err, data) => {
      let storage: Record<string, string> = {};
      if (!err) {
        try {
          storage = JSON.parse(data);
        } catch (e) {
          console.error('Error parseando storage.json:', e);
        }
      }
      const key = path.basename(filePath);
      // Simula una URL pública para el archivo
      const simulatedUrl = `http://localhost:3000/storage/${key}`;
      storage[key] = simulatedUrl;
      fs.writeFile(storagePath, JSON.stringify(storage, null, 2), (writeErr) => {
        if (writeErr) return reject(writeErr);
        resolve(simulatedUrl);
      });
    });
  });
};
 