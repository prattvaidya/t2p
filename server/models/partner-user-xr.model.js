import mongoose from "mongoose";

const PartnerUserXRSchema = new mongoose.Schema({
  partner: { type: mongoose.Schema.ObjectId, ref: "Partner" },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  username: {
    type: String,
    trim: true,
    required: "User ID is required"
  },
  password: {
    type: String,
    required: "Password is required"
  },
  salt: String,
  points: {
    type: Number,
    default: 0
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PartnerUserXR", PartnerUserXRSchema);
