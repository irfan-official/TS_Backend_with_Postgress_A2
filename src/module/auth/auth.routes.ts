import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { signup, signin } from "./auth.controllers";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

export default router;
