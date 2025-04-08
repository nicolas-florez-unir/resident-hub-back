import { LocalStorageStrategy } from '../strategies/local-storage.strategy';

export class StorageStrategyFactory {
  static createStorageStrategy(strategy: string) {
    switch (strategy) {
      case 'local':
        return new LocalStorageStrategy();
      default:
        throw new Error('Invalid storage strategy');
    }
  }
}
