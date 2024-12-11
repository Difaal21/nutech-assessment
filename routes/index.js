import httpResponse from "../helpers/http_responses/index.js";

const init = (server) => {
    server.use((req, res, next) => {
        const error = new httpResponse.NotFound();
        res.status(error.code);
        next(error);
    });

    server.use((error, req, res, next) => {

        if (error.code == 400 || error.type == "entity.parse.failed") {
            return new httpResponse.BadRequest().setMessage("Unprocessable entity").send(res);
        }

        if (error.code == 404) {
            return new httpResponse.NotFound().setMessage("Page not found").send(res);
        }

        return new httpResponse.InternalServerError().setMessage("Unexpected error").send(res);
    });
};

export default { init };