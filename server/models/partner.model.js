import mongoose from "mongoose";
import crypto from "crypto";
import User from "./user.model";
var findOrCreate = require("mongoose-findorcreate");
var SchemaTypes = mongoose.Schema.Types;
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
  conversion_rate: {
    type: Number,
    required:"Coversion factor is mandatory"
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

//this is to add findOrCreate function to this schema

PartnerSchema.plugin(findOrCreate);

//a function to remove partners added to users when deleting a partner

PartnerSchema.pre("remove", function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  User.updateMany({}, { $pull: { partners: this._id } }, { upsert: true });
  next();
});

export default mongoose.model("Partner", PartnerSchema);
