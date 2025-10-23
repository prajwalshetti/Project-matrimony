import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending",
  },
  message: {
    type: String,
    maxLength: 500,
  },
}, { timestamps: true });

// Indexes for faster queries
requestSchema.index({ receiverId: 1, status: 1 });
requestSchema.index({ senderId: 1, status: 1 });

export const Request = mongoose.model("Request", requestSchema);
