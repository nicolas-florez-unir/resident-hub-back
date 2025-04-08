import { StorageStrategy } from '../../domain/strategies/storage.strategy';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

export class LocalStorageStrategy extends StorageStrategy {
  private readonly uploadPath: string = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'public',
    'uploads',
  );

  // Método para asegurarse de que la carpeta de uploads exista
  private async ensureUploadDirectory() {
    try {
      // Verifica si la carpeta existe
      await fs.access(this.uploadPath);
    } catch (err) {
      console.log(err.code, ': Creando carpeta de uploads...');
      // Si la carpeta no existe, la crea
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDirectory();
    const filename = crypto.randomUUID() + path.extname(file.originalname);
    const filePath = path.join(this.uploadPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return filename;
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        return;
      }

      throw error;
    }
  }
}
