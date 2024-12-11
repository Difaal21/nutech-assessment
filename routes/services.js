import middlewares from "../middlewares/index.js";

const init = (server, httpHandler) => {
  server.get("/services", middlewares.userSession.verifyToken, httpHandler.getServices);
};

export default { init };