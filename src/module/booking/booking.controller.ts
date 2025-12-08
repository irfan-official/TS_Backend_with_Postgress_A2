import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { AuthRequest } from "../../middleware/auth.m";

export const createBookings = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (customer_id, vehicle_id, rent_start_date, rent_end_date) are required",
      });
    }

    const customer = await pool.query("SELECT id FROM users WHERE id = $1", [
      customer_id,
    ]);
    if (customer.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const vehicle = await pool.query(
      "SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1",
      [vehicle_id]
    );

    if (vehicle.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const vehicleData = vehicle.rows[0];

    if (vehicleData.availability_status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Vehicle is already booked",
      });
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    const differenceInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const total_price = differenceInDays * Number(vehicleData.daily_rent_price);

    const booking = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
      [vehicle_id]
    );

    const result = {
      ...booking.rows[0],
      vehicle: {
        vehicle_name: vehicleData.vehicle_name,
        daily_rent_price: vehicleData.daily_rent_price,
      },
    };

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
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
      query = `SELECT * FROM bookings WHERE customer_id = $1`;
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
    const { status } = req.body;
    const bookingId = req.params.bookingId;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required 'cancelled or returned'",
      });
    }

    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [bookingId]
    );

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    if (status !== "cancelled" && req?.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Customers can only cancel bookings",
      });
    }

    if (booking.customer_id !== req.user?.id && req?.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate && req?.user?.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You can only cancel before the start date",
      });
    }

    await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [
      booking.vehicle_id,
    ]);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    let vehicleInfo = null;

    if (req.user?.role === "admin" && status === "returned") {
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );

      const vehicleResult = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id = $1`,
        [booking.vehicle_id]
      );

      vehicleInfo = vehicleResult.rows[0];
    }

    const updated = await pool.query(
      `UPDATE bookings 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, bookingId]
    );

    let message = "";
    let responseData: any = updated.rows[0];

    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
      responseData = {
        ...responseData,
        vehicle: vehicleInfo,
      };
    }

    return res.status(200).json({
      success: true,
      message,
      data: responseData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};
