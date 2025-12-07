import { Request, Response } from "express";
import checkUserAgent from "./checkUserAgent";
import generateJwtToken from "./generateJwtToken";

export function assignJwtToken(req: Request, res: Response, payload: object) {
  const isBrowser = checkUserAgent(req);

  const token = generateJwtToken(payload);

  if (isBrowser) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      type: "cookie",
      token: null, // browser doesn't need returned token
      message: "Token assigned via cookies",
    };
  }

  // return bearer token for mobile, postman, APIs
  return {
    type: "bearer",
    token,
    message: "Token assigned via bearer",
  };
}
