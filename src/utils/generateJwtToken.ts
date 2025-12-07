import jwt, { SignOptions } from "jsonwebtoken";

function generateJwtToken(payload: object, options: SignOptions = {}): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: "7d",
    ...options,
  });

  return token;
}

export default generateJwtToken;
