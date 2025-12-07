import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import {
  getUsers,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controllers";

const router = express.Router();

// router.get("/users", getUsers);

// router.get("/users/:id", getUserById);

// router.post("/users", createUser);

// router.patch("/users/:id", updateUser);

// router.delete("/users/:id", deleteUser);

// latest ----------------------------------------->..

router.get("/", getUsers); // admin only

router.get("/:userId", getUserDetails); // both

router.post("/", createUser); // both

router.put("/:userId", updateUser); // both

router.delete("/:userId", deleteUser); // admin only

export default router;
