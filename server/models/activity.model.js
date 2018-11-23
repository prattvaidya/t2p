import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  debit_partner: { type: mongoose.Schema.ObjectId, ref: "Partner" },
  debit_points: {
    type: Number,
    default: 0
  },
  credit_partner: { type: mongoose.Schema.ObjectId, ref: "Partner" },
  credit_points: {
    type: Number,
    default: 0
  },
  // message: {
  //   type: String,
  //   trim: true
  // },
  activity_type: {
    type: String,
    enum: ['exchange', 'redeem']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Activity", ActivitySchema);
