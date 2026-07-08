const resolveRepository = require("./resolveRepository");
const Note = require("../models/Note");

const COLUMNS = [
  "id",
  "title",
  "content",
  "author",
  "dateCreated",
  "category",
];

const DEFAULT_DATA = [
  {
    id: "n-1",
    title: "Office Holiday Schedule",
    content: "Please note that the office will be closed on Friday for the national holiday.",
    author: "Ananya Iyer",
    dateCreated: "2026-07-05",
    category: "Announcement",
  },
  {
    id: "n-2",
    title: "Server Maintenance Window",
    content: "Database servers will undergo maintenance at midnight on Saturday.",
    author: "Priya Sharma",
    dateCreated: "2026-07-07",
    category: "Task",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    title: String(input.title || existing.title || "").trim(),
    content: String(input.content || existing.content || "").trim(),
    author: String(input.author || existing.author || "Anonymous").trim(),
    dateCreated: String(input.dateCreated || existing.dateCreated || new Date().toISOString().slice(0, 10)).trim(),
    category: String(input.category || existing.category || "General").trim(),
  };
}

function validateFn(item) {
  if (!item.title) throw new Error("Note Title is required.");
  if (!item.content) throw new Error("Note Content is required.");
}

module.exports = resolveRepository({
  filename: "notes",
  model: Note,
  sheetName: "Notes",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
