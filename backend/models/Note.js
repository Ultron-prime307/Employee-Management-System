const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    dateCreated: { type: String, required: true },
    category: { type: String, default: "General" }, // General, Announcement, Task
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
