import mongoose from "mongoose";
import crypto from "crypto";
import User from "./user.model";
const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required"
  },
  industry: {
    type: String,
    trim: true,
    required: "industry is required"
  },
  about: {
    type: String,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

//a function to remove partners added to users when deleting a partner

PartnerSchema.pre("remove", function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  User.updateMany({}, { $pull: { partners: this._id } }, { upsert: true });
  next();
});

export default mongoose.model("Partner", PartnerSchema);
