const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    type: { type: String, required: true }, // Headcount, Financial, Performance
    generatedBy: { type: String, required: true },
    dateCreated: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
