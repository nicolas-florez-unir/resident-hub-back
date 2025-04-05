import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';

export class CondominiumNotFoundException extends EntityNotFoundException {
  constructor(message: string) {
    super(message);
  }
}
