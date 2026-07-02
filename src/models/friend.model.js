const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enums: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const friendModel = mongoose.model("Friend", friendSchema);
module.exports = friendModel;
