import Response from "./response.js";

class OK extends Response {
  constructor(status = 0) {
    super();
    this.code = 200;
    this.status = status;
  }
};

class Created extends Response {
  constructor(status = 201) {
    super();
    this.code = 201;
    this.status = status;
  }
};

export { OK, Created };