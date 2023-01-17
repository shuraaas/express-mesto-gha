class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = message;
  }
}

export { ForbiddenErr };