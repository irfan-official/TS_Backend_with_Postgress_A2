import express, { Request, Response } from "express";
import { pool } from "../../config/db";

export const createBookings = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allBookings = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBookings = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
