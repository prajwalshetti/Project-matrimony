import mongoose, { Schema } from "mongoose";

const connectionSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestId: {
    type: Schema.Types.ObjectId,
    ref: "Request",
  },
  connectionDate: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
  },
}, { timestamps: true });

export const Connection = mongoose.model("Connection", connectionSchema);
