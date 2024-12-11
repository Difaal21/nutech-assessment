import mysql from 'mysql2/promise';
import config from "../../../config/global_config.js";
import logger from "../../utils/logger.js";

const createPool = () => {
  const mysqlConfig = config.get("/mysql");

  const options = {
    host: mysqlConfig.host,
    user: mysqlConfig.username,
    database: mysqlConfig.database,
    password: mysqlConfig.password,
    port: parseInt(mysqlConfig.port),
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
  return mysql.createPool(options);
};

const checkConnection = async (pool) => {
  try {
    const connection = await pool.getConnection();
    logger.log('mysql.checkConnection', 'Connected to MySQL', 'initiate database connection');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL', err);
  }
};

const getConnection = async (pool) => {
  const conn = await pool.getConnection();
  return conn;
};

export default { createPool, checkConnection, getConnection };