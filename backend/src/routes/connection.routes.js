import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getMyConnections,
  getConnectionById,
  removeConnection,
} from "../controllers/connection.controller.js";

const router = express.Router();

// Get all connections for logged-in user
router.get("/myConnections", verifyJWT, getMyConnections);

// Get single connection details by ID
router.get("/getConnectionByID/:connectionId", verifyJWT, getConnectionById);

// Remove a connection
router.delete("/removeConnectionByID/:connectionId", verifyJWT, removeConnection);

export default router;
