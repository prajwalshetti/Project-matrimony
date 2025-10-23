import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

// Send a connection request
router.post("/sendRequest", verifyJWT, sendRequest);

// Get all received requests (with optional status filter)
router.get("/receivedRequests", verifyJWT, getReceivedRequests);

// Get all sent requests (with optional status filter)
router.get("/sentRequests", verifyJWT, getSentRequests);

// Accept a request
router.put("/acceptRequest/:requestId", verifyJWT, acceptRequest);

// Reject a request
router.put("/rejectRequest/:requestId", verifyJWT, rejectRequest);

// Cancel a sent request
router.put("/cancelRequest/:requestId", verifyJWT, cancelRequest);

export default router;
