import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // store user info
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
 