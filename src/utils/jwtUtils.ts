import jwt from "jsonwebtoken";
import { config } from "../config";
import type { StringValue } from "ms";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: JwtPayload, expiresIn?: StringValue) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn ?? (config.jwt.expiresIn as StringValue),
  });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.secret) as JwtPayload;
