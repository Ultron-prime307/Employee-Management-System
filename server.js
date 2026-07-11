require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectMongo } = require("./backend/db");

const app = express();
const root = __dirname;
const port = Number(process.env.PORT || 8080);
const useGoogleSheets = Boolean(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);

app.use(cors());
app.use(express.json());

async function start() {
  const usingMongo = useGoogleSheets ? false : await connectMongo();
  const employees = require("./backend/repositories/employeeRepository");
  const storage = useGoogleSheets ? "google-sheets" : usingMongo ? "mongodb" : "file";

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, storage });
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

  // Helper to register REST endpoints for new entities
  function registerCrudRoutes(prefix, repo) {
    app.get(`/api/${prefix}`, async (_req, res, next) => {
      try { res.json(await repo.list()); } catch (error) { next(error); }
    });
    app.get(`/api/${prefix}/:id`, async (req, res, next) => {
      try {
        const item = await repo.get(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
      } catch (error) { next(error); }
    });
    app.post(`/api/${prefix}`, async (req, res, next) => {
      try { res.status(201).json(await repo.create(req.body)); } catch (error) { next(error); }
    });
    app.put(`/api/${prefix}/:id`, async (req, res, next) => {
      try {
        const item = await repo.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
      } catch (error) { next(error); }
    });
    app.delete(`/api/${prefix}/:id`, async (req, res, next) => {
      try {
        const removed = await repo.remove(req.params.id);
        if (!removed) return res.status(404).json({ error: "Item not found." });
        res.status(204).end();
      } catch (error) { next(error); }
    });
  }

  // Register routes for new entities
  registerCrudRoutes("schedule", require("./backend/repositories/scheduleRepository"));
  registerCrudRoutes("projects", require("./backend/repositories/projectRepository"));
  registerCrudRoutes("reports", require("./backend/repositories/reportRepository"));
  registerCrudRoutes("notes", require("./backend/repositories/noteRepository"));
  registerCrudRoutes("jobs", require("./backend/repositories/jobRepository"));
  registerCrudRoutes("hiring", require("./backend/repositories/hiringRepository"));


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
    console.log(`API storage: ${storage}`);
  });
}

start();
