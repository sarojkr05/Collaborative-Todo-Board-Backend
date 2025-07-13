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

export default mongoose.model("ActionLog", logSchema);
