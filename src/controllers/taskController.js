import taskModel from "../models/taskModel.js";
import {
  createTask,
  getAllTasks,
  taskDelete,
  updateTask,
} from "../services/taskService.js";
import { assignSmartUser } from "../services/taskService.js";

export const createTaskController = async (req, res) => {
  const user = req.user;
  try {
    const io = req.app.get("io");
    const response = await createTask(req.body, user.id, io);
    res.status(201).json(response);
  } catch (error) {
    console.log("Error creating task:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasksController = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTaskController = async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;
  try {
    const io = req.app.get("io");
    const updated = await updateTask(taskId, req.body, user.id, io);
    res.json(updated);
  } catch (err) {
    if (err.name === "ConflictError") {
      res.status(409).json({ message: err.message, serverVersion: err.task });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

export const deleteTaskController = async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;
  try {
    const io = req.app.get("io");
    const result = await taskDelete(taskId, user.id, io);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const smartAssignController = async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  try {
    const io = req.app.get("io");
    const result = await assignSmartUser(taskId, user.id, io);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTasksController = async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await taskModel
      .find({ assignedUser: userId })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
