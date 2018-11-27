import mongoose from "mongoose";
import crypto from "crypto";

const RedeemPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required"
  },
  category: {
    type: String,
    trim: true,
    required: "Category is required"
  },
  tnc: {
    type: String,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  conversion_rate: {
    type: Number,
    required: "Coversion factor is mandatory"
  },
  denominations: {
    type: [Number],
    required: "At least one denomination is required"
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("RedeemPartner", RedeemPartnerSchema);
