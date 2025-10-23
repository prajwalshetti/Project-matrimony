import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const url = process.env.FRONT_END_URL;

// Express middleware
app.use(cors({
    origin: url,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import requestRouter from "./routes/request.routes.js"
import connectionRouter from "./routes/connection.routes.js"
app.use("/api/v1/user", userRouter)
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/connection", connectionRouter);

export { app };
