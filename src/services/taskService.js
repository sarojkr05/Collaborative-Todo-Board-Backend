import { logAction } from "../repositories/actionLogRepository.js";
import {
  create,
  deleteTask,
  findAll,
  findById,
  update,
} from "../repositories/taskRepository.js";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

export const createTask = async (taskData, userId, io) => {
  if (["Todo", "In Progress", "Done"].includes(taskData.title.trim())) {
    throw new Error("Task title cannot match column names.");
  }
  try {
    const task = await create(taskData);
    await logAction(userId, "Task Created", task._id);

    io.emit("task_created", task);
    io.emit("log_created");

    return {
      message: "Task created successfully",
      task,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const tasks = await findAll();
    return tasks;
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching all tasks: ${error.message}`);
  }
};

export const updateTask = async (taskId, updatedData, userId, io) => {
  try {
    const task = await findById(taskId);
    if (!task) {
      throw new Error("Task not found!");
    }

    if (
      updatedData.lastModified &&
      new Date(updatedData.lastModified) < task.lastModified
    ) {
      const err = new Error("Conflict detected");
      err.name = "ConflictError";
      err.task = task;
      throw err;
    }

    const updated = await update(taskId, {
      ...updatedData,
      lastModified: new Date(),
    });

    await logAction(userId, `Updated task: ${updated.title}`, updated._id);

    io.emit("task_updated", updated);
    io.emit("log_created");

    return {
      message: "Task updated successfully",
      task: updated,
    };
  } catch (error) {
    console.log("❗ Error in updateTask service:", error.message);
    throw error;
  }
};

export const taskDelete = async (taskId, userId, io) => {
  try {
    const task = await deleteTask(taskId);
    if (!task) {
      throw new Error("Task not found!");
    }
    await logAction(userId, `Deleted task: ${task.title}`, task._id);
    io.emit("task_deleted", task._id);
    io.emit("log_created");

    return {
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Error deleting task: ${error.message}`);
  }
};

export const assignSmartUser = async (taskId, userId, io) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  // 1. Get all users
  const users = await User.find();

  // 2. Count their active tasks
  const counts = await Promise.all(
    users.map(async (user) => {
      const activeTasks = await Task.countDocuments({
        assignedUser: user._id,
        status: { $in: ["Todo", "In Progress"] },
      });
      return { user, count: activeTasks };
    })
  );

  // 3. Sort by task count
  counts.sort((a, b) => a.count - b.count);
  const selectedUser = counts[0]?.user;

  if (!selectedUser) throw new Error("No eligible users found");

  // 4. Assign the task
  task.assignedUser = selectedUser._id;
  await task.save();

  await logAction(
    userId,
    `Smart assigned task: ${task.title} to ${selectedUser.name}`,
    task._id
  );
  io.emit("toast", {
    message: `Smart assigned "${task.title}" to ${selectedUser.name}`,
    type: "success",
  });
  io.emit("log_created");

  return {
    message: `Task assigned to ${selectedUser.name}`,
    user: selectedUser,
    task,
  };
};
