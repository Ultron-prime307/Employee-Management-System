const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    lead: { type: String, required: true },
    status: { type: String, default: "In Progress" }, // Planning, In Progress, Completed, On Hold
    budget: { type: Number, default: 0 },
    deadline: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
