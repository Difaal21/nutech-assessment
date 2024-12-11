import httpResponse from "../helpers/http_responses/index.js";

const init = (server) => {
    server.use((req, res, next) => {
        const error = new httpResponse.NotFound();
        res.status(error.code);
        next(error);
    });

    server.use((error, req, res, next) => {
        return new httpResponse.NotFound().setMessage("Page not found").send(res);
    });
};

export default { init };