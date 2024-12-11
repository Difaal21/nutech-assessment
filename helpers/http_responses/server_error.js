import Response from "./response.js";

class InternalServerError extends Response {
  constructor(status = 500) {
    super();
    this.code = 500;
    this.status = status;
  }
}

export { InternalServerError };