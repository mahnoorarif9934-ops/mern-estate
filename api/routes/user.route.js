import express from "express";

import {
  updateUser,
  updateProfilePhoto,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ================= UPDATE PROFILE ================= */

router.post(
  "/update",
  verifyToken,
  updateUser
);

/* ================= UPDATE PROFILE PHOTO ================= */

router.post(
  "/update-photo",
  verifyToken,
  updateProfilePhoto
);

export default router;