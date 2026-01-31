class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  static async fromResponse(response: Response, fallbackMessage: string): Promise<ApiError> {
    let message = fallbackMessage;

    try {
      const data = await response.json();

      if (typeof data.error === "string") message = data.error;
    } catch {
      // Response body isn't JSON — use fallback message
    }

    return new ApiError(message, response.status);
  }
}

export { ApiError };
