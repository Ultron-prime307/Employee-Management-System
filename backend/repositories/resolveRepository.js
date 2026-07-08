const { connectMongo } = require("../db");
const { createFileRepository, createMongoRepository, createGoogleSheetsRepository } = require("./baseRepositories");

let dbMode = null; // "sheets", "mongo", "file"
let mongoConnected = null;

async function getDbMode() {
  if (dbMode) return dbMode;
  
  if (process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    dbMode = "sheets";
  } else {
    if (mongoConnected === null) {
      // Connect and cache mongo status
      mongoConnected = await connectMongo();
    }
    dbMode = mongoConnected ? "mongo" : "file";
  }
  return dbMode;
}

function resolveRepository({ filename, model, sheetName, columns, defaultData = [], normalizeFn, validateFn }) {
  let fileRepo, mongoRepo, sheetsRepo;

  async function getRepo() {
    const mode = await getDbMode();
    if (mode === "sheets") {
      if (!sheetsRepo) {
        sheetsRepo = createGoogleSheetsRepository(sheetName, columns, defaultData, normalizeFn, validateFn);
      }
      return sheetsRepo;
    } else if (mode === "mongo") {
      if (!mongoRepo) {
        mongoRepo = createMongoRepository(model, defaultData, normalizeFn, validateFn);
      }
      return mongoRepo;
    } else {
      if (!fileRepo) {
        fileRepo = createFileRepository(filename, defaultData, normalizeFn, validateFn);
      }
      return fileRepo;
    }
  }

  return {
    async list() {
      const repo = await getRepo();
      return await repo.list();
    },
    async get(id) {
      const repo = await getRepo();
      return await repo.get(id);
    },
    async create(input) {
      const repo = await getRepo();
      return await repo.create(input);
    },
    async update(id, input) {
      const repo = await getRepo();
      return await repo.update(id, input);
    },
    async remove(id) {
      const repo = await getRepo();
      return await repo.remove(id);
    },
  };
}

module.exports = resolveRepository;
