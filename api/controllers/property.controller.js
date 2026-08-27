import Property from "../models/property.model.js";

/* ================= CREATE PROPERTY ================= */

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      type,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
    } = req.body;

    if (
      !title ||
      !description ||
      !address ||
      !city ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, address, city and price are required.",
      });
    }

    const cleanTitle = title.trim();
    const cleanDescription =
      description.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();

    if (
      !cleanTitle ||
      !cleanDescription ||
      !cleanAddress ||
      !cleanCity
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields cannot be empty.",
      });
    }

    let cleanImages = [];

    if (Array.isArray(images)) {
      cleanImages = images
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim()
        )
        .map((image) => image.trim())
        .slice(0, 6);
    }

    const newProperty = new Property({
      title: cleanTitle,
      description: cleanDescription,
      address: cleanAddress,
      city: cleanCity,
      type: type || "sale",
      propertyType:
        propertyType || "house",
      price: Number(price),
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area) || 0,
      images: cleanImages,
      userRef: req.userId,
    });

    const savedProperty =
      await newProperty.save();

    return res.status(201).json({
      success: true,
      message:
        "Property created successfully.",
      property: savedProperty,
    });
  } catch (error) {
    console.error(
      "Create property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating property.",
    });
  }
};

/* ================= GET ALL PROPERTIES ================= */

export const getProperties = async (
  req,
  res
) => {
  try {
    const properties =
      await Property.find()
        .sort({ createdAt: -1 })
        .populate(
          "userRef",
          "username email photo"
        );

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get properties error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching properties.",
    });
  }
};

/* ================= GET MY PROPERTIES ================= */

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      userRef: req.userId,
    })
      .sort({ createdAt: -1 })
      .populate("userRef", "username email photo");

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get my properties error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching your properties.",
    });
  }
};

/* ================= GET SINGLE PROPERTY ================= */

export const getProperty = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const property =
      await Property.findById(id).populate(
        "userRef",
        "username email photo"
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error(
      "Get property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching property.",
    });
  }
};

/* ================= UPDATE PROPERTY ================= */

export const updateProperty = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      address,
      city,
      type,
      propertyType,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
    } = req.body;

    const property =
      await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    /* ================= OWNER CHECK ================= */

    if (
      property.userRef.toString() !==
      req.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only edit your own property.",
      });
    }

    /* ================= REQUIRED FIELDS ================= */

    if (
      !title ||
      !description ||
      !address ||
      !city ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, address, city and price are required.",
      });
    }

    const cleanTitle = title.trim();
    const cleanDescription =
      description.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();

    if (
      !cleanTitle ||
      !cleanDescription ||
      !cleanAddress ||
      !cleanCity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields cannot be empty.",
      });
    }

    /* ================= CLEAN IMAGES ================= */

    let cleanImages = [];

    if (Array.isArray(images)) {
      cleanImages = images
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim()
        )
        .map((image) => image.trim())
        .slice(0, 6);
    }

    /* ================= UPDATE DATA ================= */

    property.title = cleanTitle;

    property.description =
      cleanDescription;

    property.address =
      cleanAddress;

    property.city =
      cleanCity;

    property.type =
      type || "sale";

    property.propertyType =
      propertyType || "house";

    property.price =
      Number(price);

    property.bedrooms =
      Number(bedrooms) || 0;

    property.bathrooms =
      Number(bathrooms) || 0;

    property.area =
      Number(area) || 0;

    property.images =
      cleanImages;

    /* ================= SAVE ================= */

    const updatedProperty =
      await property.save();

    return res.status(200).json({
      success: true,
      message:
        "Property updated successfully.",
      property: updatedProperty,
    });
  } catch (error) {
    console.error(
      "Update property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating property.",
    });
  }
};

/* ================= DELETE PROPERTY ================= */

export const deleteProperty = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /* ================= FIND PROPERTY ================= */

    const property =
      await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    /* ================= OWNER CHECK ================= */

    if (
      property.userRef.toString() !==
      req.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own property.",
      });
    }

    /* ================= DELETE ================= */

    await Property.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Property deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting property.",
    });
  }
};