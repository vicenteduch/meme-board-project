import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignedTo: { type: String, default: "user1" },
    effortPoints: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    meme: { type: String, default: null },
    expanded: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
