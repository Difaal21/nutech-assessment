import middlewares from "../middlewares/index.js";

const init = (server, httpHandler) => {
  server.get("/balance", middlewares.userSession.verifyToken, httpHandler.getUserBalance);
  server.post("/topup", middlewares.userSession.verifyToken, httpHandler.topUpUserBalance);
};

export default { init };