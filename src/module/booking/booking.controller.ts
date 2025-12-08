import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { AuthRequest } from "../../middleware/auth.m";

export const createBookings = async (req: AuthRequest, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allBookings = async (req: AuthRequest, res: Response) => {
  try {
    let query: string = "";
    let options: any[] = [];

    console.log("req.user ==> ", req?.user);

    if (req?.user?.role === "admin") {
      query = `SELECT * FROM bookings`;
    } else {
      query = `SELECT * FROM bookings WHERE id = $1`;
      options.push(req?.user?.id);
    }
    const result = await pool.query(query, options);

    return res.status(200).json({
      success: true,
      message: "all data retrieve successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBookings = async (req: AuthRequest, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
