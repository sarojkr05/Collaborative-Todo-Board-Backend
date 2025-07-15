import Task from "../models/taskModel.js";

export const create = async (taskData) => {
  try {
    const task = await Task.create(taskData);
    return task;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("A task with this title already exists.");
    }
    throw error;
  }
};

export const findAll = async () => {
  try {
    const tasks = await Task.find().populate("assignedUser", "name email");
    return tasks;
  } catch (error) {
    console.log(error);
    throw new Error(`Error finding tasks: ${error.message}`);
  }
};

export const findById = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate(
      "assignedUser",
      "name email"
    );
    return task;
  } catch (error) {
    console.log(error);
    throw new Error(`Error finding task: ${error.message}`);
  }
};

export const update = async (taskId, updatedData) => {
  try {
    const task = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
      runValidators: true,
    });
    return task;
  } catch (error) {
    console.log(error);
    throw new Error(`Error updating task: ${error.message}`);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return deletedTask;
  } catch (error) {
    console.log(error);
    throw new Error(`Error deleting task: ${error.message}`);
  }
};
