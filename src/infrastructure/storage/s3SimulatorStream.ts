import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { VideoFragmentRepositoryPort } from '../../domain/port/out/VideoFragmentPort';
import { VideoFragment } from '../../domain/entity/VideoFragfment';

// Promisificar las funciones de fs para usarlas con async/await
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const fileExists = promisify(fs.exists);

export class FileSystemVideoFragmentRepository implements VideoFragmentRepositoryPort {
  // Definir la ruta al directorio externo para metadatos
  private readonly basePath = path.resolve(__dirname, '../../../external-metadata');

  constructor() {
    // Asegurarse de que el directorio exista, si no, crearlo
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  private getFilePath(sessionId: string): string {
    return path.join(this.basePath, `${sessionId}.json`);
  }

  async save(fragment: VideoFragment): Promise<void> {
    const filePath = this.getFilePath(fragment.sessionId);

    let data: any[] = [];

    // Si el archivo ya existe, leerlo
    if (fs.existsSync(filePath)) {
      const raw = await readFile(filePath, 'utf-8');
      data = JSON.parse(raw);
    }

    // Agregar el nuevo fragmento de video
    data.push({
      sessionId: fragment.sessionId,
      buffer: fragment.buffer.toString('base64'),
      timestamp: fragment.timestamp.toISOString()
    });

    // Guardar los datos en el archivo en el directorio externo
    await writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async findAllBySessionId(sessionId: string): Promise<VideoFragment[]> {
    const filePath = this.getFilePath(sessionId);

    // Si no existe el archivo de metadatos, devolver un array vacío
    if (!fs.existsSync(filePath)) return [];

    // Leer los metadatos del archivo
    const raw = await readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // Convertir los datos a objetos VideoFragment
    return data.map((item: any) => new VideoFragment(
      item.sessionId,
      Buffer.from(item.buffer, 'base64'),
      new Date(item.timestamp)
    ));
  }
}
