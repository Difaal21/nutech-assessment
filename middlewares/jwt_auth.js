
import jwt from "../helpers/jwt/index.js";
import httpResponse from "../helpers/http_responses/index.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return new httpResponse.Unauthorized().setMessage("Token tidak valid atau kadaluwarsa").send(res);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return new httpResponse.Unauthorized().setMessage("Token tidak valid atau kadaluwarsa").send(res);
  }

  try {
    const decoded = await jwt.verifyToken(token);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return new httpResponse.Unauthorized().setMessage("Token tidak tidak valid atau kadaluwarsa").send(res);
  }
};

export default { verifyToken };