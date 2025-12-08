import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import {
  createBookings,
  allBookings,
  updateBookings,
} from "./booking.controller";

const router = express.Router();

router.post("/", createBookings); // all users

router.get("/", allBookings); // 

router.put("/:bookingId", updateBookings);

export default router;
