const express = require("express");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();
const { sendRequest ,acceptRequest,cancleRequest} = require("../controllers/friendRequist.controller");

// FRIEND REQUEST    =- POST /api/friends/request
// ACCEPT FRIENDS REQUEST PATCH /api/friends/request/:requestId/accept
// CANCLE FRIEND REQUEST AND DELETE FRIEND COLLECTION FOR SENDER DELETE api/friends/request/:requestId/cancle
// DELETE FRIEND-REQUEST-DOCUMENT by receveir  DELETE api/friends/request/:requestId



router.post("/request", authUserMiddleware, sendRequest);
router.patch("/request/:requestId/accept", authUserMiddleware, acceptRequest);
router.delete("/request/:requestId/cancle",authUserMiddleware,cancleRequest)

module.exports = router;
