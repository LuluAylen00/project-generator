const {config} = require('dotenv')
config()

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_DATABASE || "databasename",
    "host": process.env.DB_HOST || "127.0.0.1", // 127.0.0.1 == localhost
    "dialect": "mysql",
    "port": process.env.DB_PORT || 3306
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_DATABASE || "databasename",
    "host": process.env.DB_HOST || "127.0.0.1", // 127.0.0.1 == localhost
    "dialect": "mysql",
    "port": process.env.DB_PORT || 3306
  },
  "production": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_DATABASE || "databasename",
    "host": process.env.DB_HOST || "127.0.0.1", // 127.0.0.1 == localhost
    "dialect": "mysql",
    "port": process.env.DB_PORT || 3306
  }
}
