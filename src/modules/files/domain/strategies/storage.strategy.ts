export abstract class StorageStrategy {
  abstract saveFile(file: Express.Multer.File): Promise<string>;
  abstract deleteFile(fileName: string): Promise<void>;
}
