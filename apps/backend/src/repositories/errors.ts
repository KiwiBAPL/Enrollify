export class RepositoryError extends Error {
  readonly repositoryCause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'RepositoryError'
    this.repositoryCause = cause
  }
}
