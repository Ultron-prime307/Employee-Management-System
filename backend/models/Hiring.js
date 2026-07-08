const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    candidateName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    jobTitle: { type: String, required: true },
    stage: { type: String, default: "Applied" }, // Applied, Screening, Interview, Offered
    status: { type: String, default: "Active" }, // Active, Rejected, Hired
    interviewDate: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hiring", hiringSchema);
