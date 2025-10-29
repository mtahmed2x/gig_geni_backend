import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { StringValue } from 'ms';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  resetToken: string;
};

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: StringValue,
): string =>
  jwt.sign(payload, secret, {
    expiresIn,
  });

export const generateAuthTokens = (
  payload: JwtPayload,
  tokenType: 'access' | 'refresh' | 'reset' | 'all' = 'all',
): Partial<AuthTokens> => {
  const tokens: Partial<AuthTokens> = {};

  if (tokenType === 'access' || tokenType === 'all') {
    tokens.accessToken = generateToken(
      payload,
      config.jwt.accessSecret,
      config.jwt.accessExpiresIn as StringValue,
    );
  }

  if (tokenType === 'refresh' || tokenType === 'all') {
    tokens.refreshToken = generateToken(
      payload,
      config.jwt.refreshSecret,
      config.jwt.refreshExpiresIn as StringValue,
    );
  }

  if (tokenType === 'reset' || tokenType === 'all') {
    tokens.resetToken = generateToken(
      payload,
      config.jwt.resetSecret,
      config.jwt.resetExpiresIn as StringValue,
    );
  }

  return tokens;
};

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;

export const verifyResetToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.resetSecret) as JwtPayload;
