import ActionLog from "../models/actionLogModel.js";

export const logAction = (userId, action, taskId) => {
  if (!userId) console.warn("⚠️ Missing userId in logAction");
  return ActionLog.create({
    user: userId,
    action,
    task: taskId
  });
};

export const fetchRecentLogs = async () => {
  return await ActionLog.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("user", "name") // optional: show user name
    .populate("task", "title");
};