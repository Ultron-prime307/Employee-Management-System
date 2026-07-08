const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    gender: { type: String, default: "Other" },
    department: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, required: true },
    joined: { type: String, required: true },
    salary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
