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

import BannerRepository from "../modules/banners/repository.js";
import BannerService from "../modules/banners/service.js";
import BannerHttpHandler from "../modules/banners/http_handler.js";
import bannerRoutes from "../routes/banners.js";

import ServiceRepository from "../modules/services/repository.js";
import ServiceService from "../modules/services/service.js";
import ServiceHttpHandler from "../modules/services/http_handler.js";
import serviceRoutes from "../routes/services.js";

import TransactionRepository from "../modules/transactions/repository.js";
import TransactionService from "../modules/transactions/service.js";
import TransactionHttpHandler from "../modules/transactions/http_handler.js";
import transactionRoutes from "../routes/transactions.js";

async function init() {
  const app = express();

  const db = mysqlConnection.createPool();
  await mysqlConnection.checkConnection(db);

  app.use(cors());
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const imagesPath = path.join(__dirname, '../images/profiles');
  app.use('/images/profiles', express.static(imagesPath));

  const userRepository = new UserRepository(db);
  const userService = new UserService(userRepository);
  const userHttpHandler = new UserHttpHandler(userService);
  userRoutes.init(app, userHttpHandler);

  const bannerRepository = new BannerRepository(db);
  const bannerService = new BannerService(bannerRepository);
  const bannerHttpHandler = new BannerHttpHandler(bannerService);
  bannerRoutes.init(app, bannerHttpHandler);

  const serviceRepository = new ServiceRepository(db);
  const serviceService = new ServiceService(serviceRepository);
  const serviceHttpHandler = new ServiceHttpHandler(serviceService);
  serviceRoutes.init(app, serviceHttpHandler);

  const transactionRepository = new TransactionRepository(db);
  const transactionService = new TransactionService(transactionRepository, serviceRepository);
  const transactionHttpHandler = new TransactionHttpHandler(transactionService);
  transactionRoutes.init(app, transactionHttpHandler);

  routes.init(app);
  return app;
}

export default init;