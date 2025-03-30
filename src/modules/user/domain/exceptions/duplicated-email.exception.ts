export class DuplicatedEmailException extends Error {
  constructor(message: string) {
    super(message);
  }
}
