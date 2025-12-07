import express, { Request, Response } from "express";
import { pool } from "../../config/db";

export const addVehicle = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allVehicles = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleDetails = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVehicleDetails = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
