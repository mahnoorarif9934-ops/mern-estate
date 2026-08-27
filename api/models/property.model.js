import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    /* ================= PROPERTY TITLE ================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= DESCRIPTION ================= */

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= ADDRESS ================= */

    address: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= CITY ================= */

    city: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= SALE / RENT ================= */

    type: {
      type: String,
      enum: ["sale", "rent"],
      default: "sale",
    },

    /* ================= PROPERTY TYPE ================= */

    propertyType: {
      type: String,
      enum: [
        "house",
        "apartment",
        "villa",
        "land",
        "commercial",
      ],
      default: "house",
    },

    /* ================= PRICE ================= */

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ================= BEDROOMS ================= */

    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= BATHROOMS ================= */

    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= AREA ================= */

    area: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================= PROPERTY IMAGES ================= */

    images: {
      type: [String],
      default: [],
    },

    /* ================= PROPERTY OWNER ================= */

    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

export default Property;