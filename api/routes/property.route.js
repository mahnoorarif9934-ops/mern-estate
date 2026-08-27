
import express from "express";

import {
  createProperty,
  getProperties,
  getMyProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ================= CREATE PROPERTY ================= */

router.post(
  "/create",
  verifyToken,
  createProperty
);

/* ================= GET ALL PROPERTIES ================= */

router.get(
  "/",
  getProperties
);

/* ================= GET MY PROPERTIES ================= */

router.get(
  "/my-properties",
  verifyToken,
  getMyProperties
);

/* ================= GET SINGLE PROPERTY ================= */

router.get(
  "/:id",
  getProperty
);

/* ================= UPDATE PROPERTY ================= */

router.put(
  "/update/:id",
  verifyToken,
  updateProperty
);

/* ================= DELETE PROPERTY ================= */

router.delete(
  "/delete/:id",
  verifyToken,
  deleteProperty
);

export default router;

