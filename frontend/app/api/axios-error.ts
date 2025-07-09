export class AxiosError extends Error {
  status?: number | undefined;

  constructor(message: string, status?: number | undefined) {
    super(message);
    this.status = status;
  }
}
