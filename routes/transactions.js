import middlewares from "../middlewares/index.js";

const init = (server, httpHandler) => {
  server.get("/balance", middlewares.userSession.verifyToken, httpHandler.getUserBalance);
  server.post("/topup", middlewares.userSession.verifyToken, httpHandler.topUpUserBalance);
  server.post("/transaction", middlewares.userSession.verifyToken, httpHandler.userTransaction);
  server.get("/transaction/history", middlewares.userSession.verifyToken, httpHandler.getUserTransactionHistory);
};

export default { init };