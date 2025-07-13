import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

taskSchema.index({ title: 1 }, { unique: true });

export default mongoose.model("Task", taskSchema);
