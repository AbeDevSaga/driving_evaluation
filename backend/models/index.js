"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;

const poolConfig = {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, poolConfig);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    ...poolConfig,
  });
}

// Function to get all model files recursively
function getModelFiles(dir, baseDir = dir) {
  const files = [];

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively get files from subdirectories
      files.push(...getModelFiles(fullPath, baseDir));
    } else if (
      item !== basename &&
      item.slice(-3) === ".js" &&
      item.indexOf(".test.js") === -1 &&
      path.basename(item) !== "index.js" // Optional: exclude index.js files
    ) {
      files.push(fullPath);
    }
  });

  return files;
}

// Load all model files
getModelFiles(__dirname).forEach((file) => {
  try {
    const model = require(file)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  } catch (error) {
    console.warn(`Failed to load model from ${file}:`, error.message);
  }
});

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
