import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";

// Get all connections for logged-in user
const getMyConnections = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const connections = await Connection.find({
    $or: [{ user1: userId }, { user2: userId }]
  })
    .populate("user1", "name profilePhoto occupation currentCity age education")
    .populate("user2", "name profilePhoto occupation currentCity age education")
    .sort({ connectionDate: -1 });

  // Format to show only the other user
  const formattedConnections = connections.map(conn => {
    const connectedUser = conn.user1._id.toString() === userId 
      ? conn.user2 
      : conn.user1;
    
    return {
      _id: conn._id,
      connectedUser,
      connectionDate: conn.connectionDate,
      lastMessageAt: conn.lastMessageAt,
    };
  });

  res.status(200).json({
    count: formattedConnections.length,
    connections: formattedConnections,
  });
});

// Get single connection details
const getConnectionById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { connectionId } = req.params;

  const connection = await Connection.findById(connectionId)
    .populate("user1", "name profilePhoto occupation currentCity age education email")
    .populate("user2", "name profilePhoto occupation currentCity age education email");

  if (!connection) {
    throw new ApiError(404, "Connection not found");
  }

  // Verify user is part of this connection
  const isParticipant = connection.user1._id.toString() === userId || 
                        connection.user2._id.toString() === userId;

  if (!isParticipant) {
    throw new ApiError(403, "Not authorized to view this connection");
  }

  res.status(200).json({
    connection,
  });
});

// Remove a connection permanently
const removeConnection = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { connectionId } = req.params;

  const connection = await Connection.findById(connectionId);

  if (!connection) {
    throw new ApiError(404, "Connection not found");
  }

  // Verify user is part of this connection
  const isParticipant = connection.user1.toString() === userId || 
                        connection.user2.toString() === userId;

  if (!isParticipant) {
    throw new ApiError(403, "Not authorized to remove this connection");
  }

  // Permanently delete
  await Connection.findByIdAndDelete(connectionId);

  res.status(200).json({
    message: "Connection removed successfully",
  });
});

export {
  getMyConnections,
  getConnectionById,
  removeConnection,
};
