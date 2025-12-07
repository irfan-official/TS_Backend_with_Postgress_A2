import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./config/db";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger.m";
import AuthRouter from "./module/auth/auth.routes";
import UserRouter from "./module/user/user.routes";
import VehiclesRouter from "./module/vehicles/vehicles.routes";
import BookingsRouter from "./module/booking/booking.route";

const app = express();

initDB();

app.use(logger);

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = Number(config.port) || 4000;

// ROOT
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: true });
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/vehicles", VehiclesRouter);
app.use("/api/v1/bookings", BookingsRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
