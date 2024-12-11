import Response from "./response.js";

class Forbidden extends Response {
  constructor(status = 403) {
    super();
    this.code = 403;
    this.status = status;
  }
}

class NotFound extends Response {
  constructor(status = 404) {
    super();
    this.code = 404;
    this.status = status;
  }
}


class Conflict extends Response {
  constructor(status = 409) {
    super();
    this.code = 404;
    this.status = status;
  }
}

class BadRequest extends Response {
  constructor(status = 102) {
    super();
    this.code = 400;
    this.status = status;
  }
}

class Unauthorized extends Response {
  constructor(status = 108) {
    super();
    this.code = 401;
    this.status = status;
  }
}

export { Forbidden, NotFound, Conflict, BadRequest, Unauthorized };
