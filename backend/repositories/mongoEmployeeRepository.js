const Employee = require("../models/Employee");
const { defaultEmployees, makeId } = require("../seed");

function toApiEmployee(employee) {
  return {
    id: employee.uid,
    code: employee.code,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    gender: employee.gender,
    department: employee.department,
    title: employee.title,
    status: employee.status,
    joined: employee.joined,
    salary: employee.salary,
  };
}

async function ensureSeedData() {
  const count = await Employee.countDocuments();
  if (count > 0) return;

  await Employee.insertMany(
    defaultEmployees.map(({ id, ...employee }) => ({
      uid: id,
      ...employee,
    }))
  );
}

async function nextEmployeeCode() {
  const employees = await Employee.find({}, { code: 1 }).lean();
  const max = employees.reduce((highest, employee) => {
    const match = String(employee.code || "").match(/^#EP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return "#EP" + String(max + 1).padStart(4, "0");
}

function normalizeInput(input, existing = {}) {
  return {
    name: String(input.name || existing.name || "").trim(),
    email: String(input.email || existing.email || "").trim(),
    phone: String(input.phone || existing.phone || "").trim(),
    gender: input.gender || existing.gender || "Other",
    department: input.department || existing.department || "Design",
    title: String(input.title || existing.title || "Team Member").trim(),
    status: input.status || existing.status || "Full-time",
    joined: input.joined || existing.joined || new Date().toISOString().slice(0, 10),
    salary: Number(input.salary ?? existing.salary ?? 0) || 0,
  };
}

function validateEmployee(employee) {
  if (!employee.name) {
    const error = new Error("Name is required.");
    error.status = 400;
    throw error;
  }

  if (!employee.email) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }
}

async function list() {
  await ensureSeedData();
  const employees = await Employee.find().sort({ createdAt: 1 }).lean();
  return employees.map(toApiEmployee);
}

async function get(id) {
  const employee = await Employee.findOne({ uid: id }).lean();
  return employee ? toApiEmployee(employee) : null;
}

async function create(input) {
  const employee = {
    uid: input.id || makeId(),
    code: input.code || (await nextEmployeeCode()),
    ...normalizeInput(input),
  };

  validateEmployee(employee);
  const created = await Employee.create(employee);
  return toApiEmployee(created);
}

async function update(id, input) {
  const existing = await Employee.findOne({ uid: id }).lean();
  if (!existing) return null;

  const employee = normalizeInput(input, existing);
  validateEmployee(employee);

  const updated = await Employee.findOneAndUpdate({ uid: id }, employee, {
    new: true,
  }).lean();
  return toApiEmployee(updated);
}

async function remove(id) {
  const result = await Employee.deleteOne({ uid: id });
  return result.deletedCount > 0;
}

module.exports = { list, get, create, update, remove, ensureSeedData };
