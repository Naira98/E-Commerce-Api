import dotenv from "dotenv";

dotenv.config();

const development = process.env.NODE_ENV === "development";
const SERVER_PORT = Number(process.env.SERVER_PORT) || 1337;

const MONGO_URI = process.env.MONGO_URI || '';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "jwtacesssecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "jwtrefreshsecret";

const config = {
  server: {
    port: SERVER_PORT,
    dev: development,
  },
  mongo: {
    url: MONGO_URI,
  },
  jwt: {
    accessSecret: JWT_ACCESS_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
  },
};

export default config;
