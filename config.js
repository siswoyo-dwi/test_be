require('dotenv').config();


module.exports = {
  db: {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    user: process.env.USER,
    password: process.env.PWD,
    database: process.env.DB,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};
