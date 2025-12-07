import express, { Request, Response } from "express";
import { pool } from "../../config/db";

export const signup = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
