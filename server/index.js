import express from "express";
import cors from "cors";
import routes from "../routes/index.js";
import mysqlConnection from "../helpers/databases/mysql/index.js";
import helmet from "helmet";

import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import UserRepository from "../modules/users/repository.js";
import UserService from "../modules/users/service.js";
import UserHttpHandler from "../modules/users/http_handler.js";
import userRoutes from "../routes/users.js";

async function init() {
  const app = express();

  const db = mysqlConnection.createPool();
  await mysqlConnection.checkConnection(db);
  const conn = await db.getConnection(db);

  app.use(cors());
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const imagesPath = path.join(__dirname, '../images/profiles');
  app.use('/images/profiles', express.static(imagesPath));

  const userRepository = new UserRepository(conn);
  const userService = new UserService(userRepository);
  const userHttpHandler = new UserHttpHandler(userService);

  userRoutes.init(app, userHttpHandler);
  routes.init(app);
  return app;
}

export default init;