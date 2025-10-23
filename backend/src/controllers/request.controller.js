import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Request } from "../models/request.model.js";
import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";

// Send a connection request
const sendRequest = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  // Prevent self-requests
  if (senderId === receiverId) {
    throw new ApiError(400, "Cannot send request to yourself");
  }

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new ApiError(404, "User not found");
  }

  // Check if pending request already exists from this sender
  const existingPendingRequest = await Request.findOne({
    senderId,
    receiverId,
    status: "pending"
  });

  if (existingPendingRequest) {
    throw new ApiError(400, "Request already pending");
  }

  // Check if connection already exists (in either order)
  const existingConnection = await Connection.findOne({
    $or: [
      { user1: senderId, user2: receiverId },
      { user1: receiverId, user2: senderId }
    ]
  });

  if (existingConnection) {
    throw new ApiError(400, "Connection already exists");
  }

  // Create new request
  const request = await Request.create({
    senderId,
    receiverId,
    message: message || "",
    status: "pending",
  });

  const populatedRequest = await Request.findById(request._id)
    .populate("senderId", "name profilePhoto occupation currentCity")
    .populate("receiverId", "name profilePhoto occupation currentCity");

  res.status(201).json({
    message: "Request sent successfully",
    request: populatedRequest,
  });
});

// Get all received requests
const getReceivedRequests = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  const filter = { receiverId: userId };
  if (status) {
    filter.status = status;
  }

  const requests = await Request.find(filter)
    .populate("senderId", "name profilePhoto occupation currentCity age education")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: requests.length,
    requests,
  });
});

// Get all sent requests
const getSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  const filter = { senderId: userId };
  if (status) {
    filter.status = status;
  }

  const requests = await Request.find(filter)
    .populate("receiverId", "name profilePhoto occupation currentCity age education")
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: requests.length,
    requests,
  });
});

// Accept a request
const acceptRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { requestId } = req.params;

  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  // Only receiver can accept
  if (request.receiverId.toString() !== userId) {
    throw new ApiError(403, "Not authorized to accept this request");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, `Request is already ${request.status}`);
  }

  // Update request status
  request.status = "accepted";
  await request.save();

  // Create connection
  const connection = await Connection.create({
    user1: request.senderId,
    user2: request.receiverId,
    requestId: request._id,
    connectionDate: new Date(),
  });

  const populatedConnection = await Connection.findById(connection._id)
    .populate("user1", "name profilePhoto occupation currentCity")
    .populate("user2", "name profilePhoto occupation currentCity");

  res.status(200).json({
    message: "Request accepted successfully",
    connection: populatedConnection,
  });
});

// Reject a request
const rejectRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { requestId } = req.params;

  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  // Only receiver can reject
  if (request.receiverId.toString() !== userId) {
    throw new ApiError(403, "Not authorized to reject this request");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, `Request is already ${request.status}`);
  }

  request.status = "rejected";
  await request.save();

  res.status(200).json({
    message: "Request rejected successfully",
  });
});

// Cancel a sent request
const cancelRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { requestId } = req.params;

  const request = await Request.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  // Only sender can cancel
  if (request.senderId.toString() !== userId) {
    throw new ApiError(403, "Not authorized to cancel this request");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, "Can only cancel pending requests");
  }

  request.status = "cancelled";
  await request.save();

  res.status(200).json({
    message: "Request cancelled successfully",
  });
});

export {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
