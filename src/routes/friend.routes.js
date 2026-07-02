const express = require("express");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  cancleRequest,
  rejectRequest,
  getAllRequests,
  getAllFriends,
} = require("../controllers/friend.controller");

// FRIEND REQUEST    =- POST /api/friends/request
// ACCEPT  REQUEST =-   PATCH /api/friends/request/:requestId/accept  <== isme friend (collection) model ka id pass karna hai
// CANCLE  REQUEST AND DELETE FRIEND COLLECTION FOR SENDER   =- DELETE api/friends/request/:requestId/cancle
// DELETE FRIEND-REQUEST-DOCUMENT by Receiver    =- DELETE  api/friends/request/:requestId/reject
// GET ALL PENDING REQUESTS FROM DOCUMENT LOGIN USER =- GET /api/friends/requests
// GET CURRENT USER FRIENDS FROM FRIEND DOCUMENT  =- GET /api/friends/get

router.post("/request", authUserMiddleware, sendRequest);
router.patch("/request/:requestId/accept", authUserMiddleware, acceptRequest);
router.delete("/request/:requestId/cancle", authUserMiddleware, cancleRequest);
router.delete("/request/:requestId/reject", authUserMiddleware, rejectRequest);
router.get("/requests", authUserMiddleware, getAllRequests);
router.get("/get", authUserMiddleware, getAllFriends);

module.exports = router;
