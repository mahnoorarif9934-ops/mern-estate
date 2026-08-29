import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import propertyRouter from "./routes/property.route.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "https://mern-estate1406.netlify.app",
    credentials: true,
  })
);

app.use(express.json());

/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Estate API is running successfully.",
  });
});

/* ================= API ROUTES ================= */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);

/* ================= DATABASE ================= */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO);

    isConnected = true;

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    throw error;
  }
};

/* ================= VERCEL HANDLER ================= */

const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
};

export default handler;