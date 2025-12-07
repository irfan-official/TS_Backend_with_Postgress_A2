// jwt token assign
// cookies assign

// encrypt password with bcryptjs

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d"; // example

export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

export function assignAuthCookie(res: Response, token: string) {
  res.cookie("auth_token", token, {
    httpOnly: true, // cannot be accessed by JS (secure)
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function verifyJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // contains { id: userId, iat, exp }
  } catch (error) {
    return null;
  }
}
