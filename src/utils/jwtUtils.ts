import jwt from "jsonwebtoken";
import { config } from "../config";
import type { StringValue } from "ms";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: StringValue
): string =>
  jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateAuthTokens = (
  payload: JwtPayload,
  tokenType: "access" | "refresh" | "both" = "both"
): Partial<AuthTokens> => {
  const tokens: Partial<AuthTokens> = {};

  if (tokenType === "access" || tokenType === "both") {
    const accessToken = generateToken(
      payload,
      config.jwt.accessSecret,
      config.jwt.accessExpiresIn as StringValue
    );
    tokens.accessToken = accessToken;
  }

  if (tokenType === "refresh" || tokenType === "both") {
    const refreshToken = generateToken(
      payload,
      config.jwt.refreshSecret,
      config.jwt.refreshExpiresIn as StringValue
    );
    tokens.refreshToken = refreshToken;
  }

  return tokens;
};

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
