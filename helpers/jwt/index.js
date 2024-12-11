import jwt from "jsonwebtoken";
import config from "../../config/global_config.js";
const secret = config.get('/jwtKey');

const generateToken = (data, options) => {
  return jwt.sign(data, secret, options);
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

export default { generateToken, verifyToken };