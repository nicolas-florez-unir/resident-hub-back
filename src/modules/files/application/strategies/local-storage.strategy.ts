import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { StorageStrategy } from '../../domain/strategies/storage.strategy';

export class LocalStorageStrategy extends StorageStrategy {
  private readonly logger = new Logger(LocalStorageStrategy.name);
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

  constructor() {
    super();
    this.ensureUploadDirectory()
      .then(() => this.logger.log('Upload directory is ready'))
      .catch((err) => this.logger.fatal('Error creating upload directory:', err));
  }

  // Método para asegurarse de que la carpeta de uploads exista
  private async ensureUploadDirectory() {
    try {
      // Verifica si la carpeta existe
      await fs.access(this.uploadPath);
    } catch {
      this.logger.warn('Carpeta de uploads no existe, creando...');
      // Si la carpeta no existe, la crea
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
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
        // Si el archivo no existe, no es un error crítico
        this.logger.error(
          `El archivo ${fileName} no existe en el sistema de archivos. Omitiendo eliminación.`,
        );
        return;
      }

      throw error;
    }
  }
}
