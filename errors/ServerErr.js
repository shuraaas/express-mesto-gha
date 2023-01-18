class ServerErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = message;
  }
}

export { ServerErr };
