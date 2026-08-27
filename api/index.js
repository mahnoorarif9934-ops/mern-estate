import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import propertyRouter from "./routes/property.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO;

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Estate API is running successfully.",
  });
});

/* ================= AUTH ROUTES ================= */

app.use("/api/auth", authRouter);

/* ================= USER ROUTES ================= */

/* ================= API ROUTES ================= */

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);

/* ================= DATABASE ================= */

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO);

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

/* ================= START SERVER ================= */

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
};

startServer();