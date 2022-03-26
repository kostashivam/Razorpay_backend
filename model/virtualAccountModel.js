const mongoose = require("mongoose");

const VirtualAccount = new mongoose.Schema(
  {
    _id:{
      type: String,
      required: true
    },
    // account_id: {
    //   type: String,
    // },
    customer_id: {
      type: String,
    },
    customer_name: {
      type: String,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: String,
      enum: ["true", "false"],
      default: "true",
    },
    amount: {
      type: Number,
      default: 0,
    },
    method: {
      type: String,
      enum: ["NEFT", "IMPS", "RTGS"],
      default: "NEFT",
    },
  },
  { timestamps: true }
);

const virtualAccountModel = mongoose.model("VirtualAccount", VirtualAccount);

module.exports = virtualAccountModel;
