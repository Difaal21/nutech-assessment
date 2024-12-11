import middlewares from "../middlewares/index.js";


const init = (server, httpHandler) => {
    server.post("/registration", httpHandler.registration);
    server.post("/login", httpHandler.login);
    server.get("/profile", middlewares.userSession.verifyToken, httpHandler.getProfile);
    server.put("/profile/update", middlewares.userSession.verifyToken, httpHandler.updateProfile);
    server.put("/profile/image", middlewares.userSession.verifyToken, middlewares.fileUploader, httpHandler.uploadProfileImage);
};


export default { init };