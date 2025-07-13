import express from "express";
import { getRecentLogs } from "../controllers/logController.js";

const logRouter = express.Router();

logRouter.get("/recent", getRecentLogs);

export default logRouter;
