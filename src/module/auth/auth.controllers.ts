import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import { assignJwtToken } from "../../utils/assignJwtToken";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const payLoad = {
      id: user.id,
      role: user.role,
    };

    const typeCheck = assignJwtToken(req, res, payLoad);

    if (typeCheck.type === "Bearer") {
      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token: typeCheck.token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, role = "user" } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists
    const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role)
       VALUES($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, hashedPassword, phone, role]
    );
    const user = result.rows[0];

    const payLoad = {
      id: result.rows[0].id,
      role: role,
    };

    const tokenResult = assignJwtToken(req, res, payLoad);

    if (tokenResult.type === "Bearer") {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token: tokenResult.token,
        data: user,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
