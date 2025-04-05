export class UserAlreadyExistException extends Error {
  constructor(message: string) {
    super(message);
  }
}
