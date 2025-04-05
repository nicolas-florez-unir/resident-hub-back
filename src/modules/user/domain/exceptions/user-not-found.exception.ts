import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';

export class UserNotFoundException extends EntityNotFoundException {
  constructor(message: string) {
    super(message);
  }
}
