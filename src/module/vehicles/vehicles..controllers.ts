import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { AuthRequest } from "../../middleware/auth.m";

export const addVehicle = async (req: AuthRequest, res: Response) => {
  try {
    let {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status = "available",
    } = req.body;

    vehicle_name = vehicle_name?.trim();
    type = type?.trim();
    registration_number = registration_number?.trim();
    daily_rent_price = Number(daily_rent_price);
    availability_status = availability_status.trim()?.toLowerCase();

    if (isNaN(daily_rent_price) || daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid daily_rent_price",
      });
    }

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validTypes = ["car", "bike", "van", "SUV"];
    const validAvailability_status = ["available", "booked"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: false,
        message: "Invalid type",
      });
    }

    if (!validAvailability_status.includes(availability_status)) {
      return res.status(403).json({
        status: false,
        message: "Invalid availability_status",
      });
    }

    const existing = await pool.query(
      `SELECT * FROM vehicles WHERE registration_number = $1`,
      [registration_number]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO vehicles( vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status)
       VALUES($1, $2, $3, $4, $5)
       RETURNING id, vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status, created_at`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Vehicle ${result?.rows[0]?.registration_number} created successfully`,
      data: result?.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);

    return res.status(200).json({
      success: true,
      message: "All vehicles retrieve successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleDetails = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      req?.params?.vehicleId,
    ]);

    if (result?.rows?.length === 0) {
      res.status(500).json({
        success: false,
        message: "Vehicle found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `vehicles ${result?.rows[0]?.id}'s data retrieve successfully`,
        data: result?.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVehicleDetails = async (req: AuthRequest, res: Response) => {
  try {
    let {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    vehicle_name = vehicle_name?.trim();
    type = type?.trim();
    registration_number = registration_number?.trim();
    daily_rent_price = Number(daily_rent_price);
    availability_status = availability_status.trim()?.toLowerCase();

    if (isNaN(daily_rent_price) || daily_rent_price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid daily_rent_price",
      });
    }

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      !availability_status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validTypes = ["car", "bike", "van", "SUV"];
    const validAvailability_status = ["available", "booked"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: false,
        message: "Invalid type",
      });
    }

    if (!validAvailability_status.includes(availability_status)) {
      return res.status(403).json({
        status: false,
        message: "Invalid availability_status",
      });
    }

    const updatedVehicle = await pool.query(
      `
      UPDATE vehicles
      SET 
        vehicle_name = $1,
        type = $2,
        registration_number = $3,
        daily_rent_price = $4,
        availability_status = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        req?.params?.vehicleId,
      ]
    );

    if (updatedVehicle.rows.length === 0) {
      return res.status(400).json({
        status: false,
        message: `Vehicle ${req?.params?.vehicleId} not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Vehicle ${updatedVehicle.rows[0]?.id} updated successfully`,
      data: updatedVehicle.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
      req.params.vehicleId,
    ]);

    if (result.rowCount === 0) {
      res.status(400).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: `vehicles ${req?.params?.vehicleId} deleted successfully`,
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
