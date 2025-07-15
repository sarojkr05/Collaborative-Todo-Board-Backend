import express from "express";
import {
  createTaskController,
  getAllTasksController,
  updateTaskController,
  deleteTaskController,
  smartAssignController,
  getMyTasksController,
} from "../controllers/taskController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const taskRouter = express.Router();

taskRouter.use(authenticateUser);

taskRouter.post("/", createTaskController);
taskRouter.get("/", getAllTasksController);
taskRouter.put("/:taskId", updateTaskController);
taskRouter.delete("/:taskId", deleteTaskController);
taskRouter.get("/my-tasks", authenticateUser, getMyTasksController);

taskRouter.post("/:taskId/smart-assign", smartAssignController);

export default taskRouter;
