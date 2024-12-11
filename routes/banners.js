const init = (server, httpHandler) => {
  server.get("/banner", httpHandler.getBanners);
};

export default { init };