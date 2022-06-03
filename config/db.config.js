module.exports = {
  HOST: process.env.DATABASE_SERVER_ENDPOINT,
  USER: process.env.DATABASE_SERVER_USERNAME,
  PASSWORD: process.env.DATABASE_SERVER_PASSWORD,
  DB: process.env.DATABASE_NAME,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
