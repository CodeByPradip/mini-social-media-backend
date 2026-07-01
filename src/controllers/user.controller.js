const imagekit = require("../config/imagekit");

const userModel = require("../models/user.model");



const updateProfileImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = file.buffer.toString("base64");

    // upload to ImageKit
    const result = await imagekit.upload({
      file: base64,
      fileName: file.originalname,
      folder: "/profiles",
    });

    const user = await userModel.findById(userId);

    // 1. old images inactive karo
    user.profileImages.forEach((img) => {
      img.isActive = false;
    });

    // 2. new image add karo
    user.profileImages.push({
      url: result.url,
      isActive: true,
    });

    // 3. current profile image update karo
    user.profileImage = result.url;

    await user.save();

    res.json({
      message: "Profile image updated with history",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
module.exports = { updateProfileImage };
