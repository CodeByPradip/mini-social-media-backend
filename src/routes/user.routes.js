const express = require("express");
const router = express.Router();
const { updateProfileImage } = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middelware");
const { authUserMiddleware } = require("../middlewares/auth.middleware");




// UPDATE PROFILE    API /api/user/upload

router.post("/upload",authUserMiddleware, upload.single("image"), updateProfileImage);
module.exports = router;
