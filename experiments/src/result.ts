export class Result<T> {
  readonly data: T | null | undefined;
  readonly error: string | null | undefined;

  private constructor(data: T | null | undefined, error: string | null | undefined) {
    this.data = data;
    this.error = error;
  }

  static success<T>(data?: T): Result<T> {
    return new Result<T>(data, null);
  }

  static failure<T>(error: string): Result<T> {
    return new Result<T>(null, error);
  }
}