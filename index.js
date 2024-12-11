import logger from "./helpers/utils/logger.js";
import server from "./server/index.js";
import config from "./config/global_config.js";
const PORT = config.get('/port');


server()
  .then(app => {
    const ctx = 'server.listen';
    app.listen(PORT, () => {
      logger.log(ctx, `Apps started, listening at ${PORT}`, 'initate application');
    });
  })
  .catch(err => {
    console.error('Failed to initialize the app:', err);
  });