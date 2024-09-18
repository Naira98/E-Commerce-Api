import dotenv from "dotenv";

dotenv.config();

const development = process.env.NODE_ENV === "development";
const SERVER_PORT = Number(process.env.SERVER_PORT) || 1337;

const MONGO_USER = process.env.MONGO_USER || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.xk4dvlj.mongodb.net/E-Commerce-Api`;

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "jwtacesssecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "jwtrefreshsecret";

const config = {
  server: {
    port: SERVER_PORT,
    dev: development,
  },
  mongo: {
    url: MONGO_URL,
  },
  jwt: {
    accessSecret: JWT_ACCESS_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
  },
};

export default config;
