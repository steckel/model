class NotImplementedError extends Error {
  constructor(message) {
    this.name = "NotImplementedError";
    this.message = message || "";
  }
}

module.exports = NotImplementedError;
