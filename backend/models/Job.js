const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Remote, Contract
    salaryRange: { type: String, default: "" },
    status: { type: String, default: "Open" }, // Open, Closed
    datePosted: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
