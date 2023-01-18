class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = message;
  }
}

export { ForbiddenErr };
