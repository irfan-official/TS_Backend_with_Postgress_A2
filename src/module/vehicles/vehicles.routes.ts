import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import {
  addVehicle,
  allVehicles,
  vehicleDetails,
  updateVehicleDetails,
  deleteVehicle,
} from "./vehicles..controllers";
import authorizeMiddleware from "../../middleware/role.m";

const router = express.Router();

router.post("/", authorizeMiddleware, addVehicle); // admin only
router.get("/", allVehicles);
router.get("/:vehicleId", vehicleDetails);
router.put("/:vehicleId", authorizeMiddleware, updateVehicleDetails);
router.delete("/:vehicleId", authorizeMiddleware, deleteVehicle); //admin only

export default router;
