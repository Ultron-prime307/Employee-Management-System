require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectMongo } = require("./backend/db");

const app = express();
const root = __dirname;
const port = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json());

async function start() {
  const usingMongo = await connectMongo();
  const employees = usingMongo
    ? require("./backend/repositories/mongoEmployeeRepository")
    : require("./backend/repositories/fileEmployeeRepository");

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, storage: usingMongo ? "mongodb" : "file" });
  });

  app.get("/api/employees", async (_req, res, next) => {
    try {
      res.json(await employees.list());
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/employees/:id", async (req, res, next) => {
    try {
      const employee = await employees.get(req.params.id);
      if (!employee) return res.status(404).json({ error: "Employee not found." });
      res.json(employee);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/employees", async (req, res, next) => {
    try {
      const employee = await employees.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/employees/:id", async (req, res, next) => {
    try {
      const employee = await employees.update(req.params.id, req.body);
      if (!employee) return res.status(404).json({ error: "Employee not found." });
      res.json(employee);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/employees/:id", async (req, res, next) => {
    try {
      const removed = await employees.remove(req.params.id);
      if (!removed) return res.status(404).json({ error: "Employee not found." });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.get("/", (_req, res) => {
    res.sendFile(path.join(root, "roster.html"));
  });

  app.get("/roster.html", (_req, res) => {
    res.sendFile(path.join(root, "roster.html"));
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Server error.",
    });
  });

  app.listen(port, "127.0.0.1", () => {
    console.log(`http://127.0.0.1:${port}/`);
    console.log(`API storage: ${usingMongo ? "mongodb" : "file"}`);
  });
}

start();
