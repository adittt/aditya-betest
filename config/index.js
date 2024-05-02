const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = './.env';
  dotEnv.config({ path: configFile });
  console.log(configFile)
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  // BASE_URL: process.env.BASE_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT
};
