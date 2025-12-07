import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

const config = {
  connection_str: process.env.CONNECTION_STR as string,
  port: process.env.PORT as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires_in: (process.env.JWT_EXPIRES_IN as string) || "7d",
};

export default config;
