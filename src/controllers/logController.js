import { fetchRecentLogs } from "../repositories/actionLogRepository.js";

export const getRecentLogs = async (req, res) => {
  try {
    const logs = await fetchRecentLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
