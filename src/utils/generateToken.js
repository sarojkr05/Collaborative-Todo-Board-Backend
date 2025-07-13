import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    serverConfig.JWT_SECRET,
    { expiresIn: serverConfig.JWT_EXPIRES_IN }
  );
};
