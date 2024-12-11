import middlewares from "../middlewares/index.js";

const init = (server, httpHandler) => {
  server.get("/balance", middlewares.userSession.verifyToken, httpHandler.getUserBalance);
};

export default { init };