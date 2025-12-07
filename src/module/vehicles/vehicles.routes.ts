import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import {
  addVehicle,
  allVehicles,
  vehicleDetails,
  updateVehicleDetails,
  deleteVehicle,
} from "./vehicles..controllers";

const router = express.Router();

router.post("/", addVehicle); // admin only
router.get("/", allVehicles);
router.get("/:vehicleId", vehicleDetails);
router.put("/:vehicleId", updateVehicleDetails);
router.delete("/:vehicleId", deleteVehicle); //admin only

export default router;
