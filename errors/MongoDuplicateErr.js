class MongoDuplicateErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = message;
  }
}

export { MongoDuplicateErr };
