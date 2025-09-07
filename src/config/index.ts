import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  app: {
    port: Number(process.env.PORT) || 5000,
    socketPort: Number(process.env.SOCKET_PORT) || 6000,
    env: process.env.NODE_ENV || "development",
  },
  db: {
    uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharma-db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "supersecret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
