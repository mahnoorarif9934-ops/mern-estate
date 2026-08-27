import User from "../models/user.model.js";

/* ================= UPDATE USER ================= */

export const updateUser = async (req, res) => {
  try {
    const { username, email, photo } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required.",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Username and email cannot be empty.",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail },
      ],
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email is already in use.",
      });
    }

    const updateData = {
      username: cleanUsername,
      email: cleanEmail,
    };

    if (typeof photo === "string" && photo.trim()) {
      updateData.photo = photo.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating your profile.",
    });
  }
};

/* ================= UPDATE PROFILE PHOTO ================= */

export const updateProfilePhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo || typeof photo !== "string") {
      return res.status(400).json({
        success: false,
        message: "Profile image is required.",
      });
    }

    const cleanPhoto = photo.trim();

    if (!cleanPhoto) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile image.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        photo: cleanPhoto,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile photo error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile image.",
    });
  }
};