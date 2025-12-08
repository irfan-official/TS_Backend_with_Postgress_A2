import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import {
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} from "./user.controllers";
import authorizeMiddleware from "../../middleware/role.m";

const router = express.Router();

router.get("/", authorizeMiddleware, getUsers); // admin only

router.get("/:userId", getUserDetails); // both

router.put("/:userId", updateUser); // both

router.delete("/:userId", authorizeMiddleware, deleteUser); // admin only

export default router;
