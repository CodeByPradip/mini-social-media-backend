const { default: mongoose } = require("mongoose");
const friendModel = require("../models/friend.model");
const userModel = require("../models/user.model");

// CREATE FRIEND REQUEST API /api/friends/request
const sendRequest = async (req, res) => {
  //  1 login user ki id nikalo
  //  2 reciver ki id nikalo
  //  3 reciver user database mai hai ki nai check karna hoga
  //  4 user khudki id mai toh friend request nai kar raha check karna hoga | sender._id === reciver._id get throw
  //  5 check karna hoga ki already pendig request hai ki nai
  //  6 check karna hoga ki already friend toh nai hai ?
  //  7 agar sab sahi hai toh friend request create karo

  try {
    const userId = req.user;
    const { username } = req.body;

    // check username is not empty
    if (!username.trim() || !username) {
      return res.status(400).json({ message: "username required" });
    }

    // check recevir user is exits database
    const receiver = await userModel.findOne({ username });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    // check receiver id user id not equal
    if (receiver._id.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to your self " });
    }

    // check friend request has already pending
    const alredyPendingRequest = await friendModel.findOne({
      sender: userId,
      receiver: receiver._id,
      status: "pending",
    });

    if (alredyPendingRequest) {
      return res.status(409).json({ message: "Friend request already send" });
    }

    // check incoming request is pending
    const incomingRequest = await friendModel.findOne({
      sender: receiver._id,
      receiver: userId,
      status: "pending",
    });

    if (incomingRequest) {
      return res.status(409).json({
        message:
          "This user has already sent you a friend request. Please accept or reject it.",
      });
    }

    // check both user are already friends
    const alreadyFriends = await friendModel.findOne({
      $or: [
        {
          sender: userId,
          receiver: receiver._id,
          status: "accepted",
        },
        {
          sender: receiver._id,
          receiver: userId,
          status: "accepted",
        },
      ],
    });

    if (alreadyFriends) {
      return res.status(409).json({
        message: "Already friends",
      });
    }

    // create friend request
    const friendRequest = await friendModel.create({
      sender: userId,
      receiver: receiver._id,
    });

    return res.status(201).json({
      message: "Friend request send successfully",
      friendRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Friend request failed" });
  }
};

// ACCEPT FRIEND REQUEST API /api/friends/request/:requestId/accept
const acceptRequest = async (req, res) => {
  // 1. Login user ki id nikalo (req.user)
  // 2. Params se requestId nikalo
  // 3. Check requestId valid hai ki nahi
  // 4. Friend request database me exist karti hai ya nahi
  // 5. Check request pending hai ya nahi
  // 6. Check login user hi receiver hai ya nahi (receive id hi friend request accept karsakta hai.)
  // 7. Friend request ko accepted update karo

  try {
    const receiverId = req.user;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "request id invalid" });
    }

    if (!requestId) {
      return res.status(400).json({ message: "request id invalid" });
    }
    // find friend request document
    const friendRequest = await friendModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const validateReceiver = friendRequest.receiver.equals(receiverId);

    // check request.recever === recevierId
    if (!validateReceiver) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // check request already accepted
    if (friendRequest.status === "accepted") {
      return res.status(409).json({
        message: "Friend request already accepted",
      });
    }

    // check request already rejected
    if (friendRequest.status === "rejected") {
      return res.status(409).json({ message: "already request rejected" });
    }

    // update accepted user pending => accepted or friends

    friendRequest.status = "accepted";
    await friendRequest.save();

    return res.status(200).json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Accept request failed" });
  }
};

// CANCLE FRIEND REQUEST API /api/friends/request/:requestId/cancle
const cancleRequest = async (req, res) => {
      // 1 Login user id लो → req.user 
      // 2 requestId लो
      // 3 Validate requestId
      // 4 Friend Request document निकालो
      // 5 Document नहीं मिला → 404
      // 6 Check friendRequest.sender === req.user
      // अगर नहीं → 403 Forbidden
      // Check status === "pending"
      // अगर pending नहीं → 409
      // Document delete करो
      // Success response

  try {
     // 1 Login user id लो → req.user 
    const canclerUserId = req.user;
    const { requestedId } = req.params;

      // 3 Validate requestId
    if (!mongoose.Types.ObjectId.isValid(requestedId)) {
      return res.status(400).json({ message: "request id invalid" });
    }

      // 3 Validate requestId
    if (!requestedId) {
      return res.status(400).json({ message: "request id invalid" });
    }

      // 4 Friend Request document निकालो
    const friendRequest = await friendModel.findById(requestedId);
    console.log("friend request collection",friendRequest);
          // 5 Document नहीं मिला → 404
    if(!friendRequest){
      return res.status(404).json({message:"Forbidden"});
    }

      // 6 Check friendRequest.sender === req.user
    const senderUserMatch = friendRequest.sender.equals(req.user);
    if(!senderUserMatch){
      return res
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Request cancle failed" });
  }

  const cancleUserId = req.user;
  const { requestedId } = req.params;
};

module.exports = { sendRequest, acceptRequest,cancleRequest };
