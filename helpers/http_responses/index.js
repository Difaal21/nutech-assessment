import { OK, Created } from "./successful.js";
import { Forbidden, NotFound, Conflict, BadRequest, Unauthorized } from "./client_error.js";
import { InternalServerError } from "./server_error.js";

export default { OK, Created, BadRequest, Unauthorized, Forbidden, Conflict, NotFound, InternalServerError };