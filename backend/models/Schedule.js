const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    shiftDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "Scheduled" }, // Scheduled, Completed, Absent
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
