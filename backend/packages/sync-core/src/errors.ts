export class SourceNotFoundError extends Error {
  readonly sourceId: number;

  constructor(sourceId: number) {
    super(`Source not found: ${sourceId}`);
    this.name = "SourceNotFoundError";
    this.sourceId = sourceId;
  }
}
