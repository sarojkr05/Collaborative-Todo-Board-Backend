import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: {
    type: String,
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ActionLog = mongoose.model("ActionLog", logSchema);
export default ActionLog;
