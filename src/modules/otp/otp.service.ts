import { Types } from "mongoose";
import { generateOtp, hashOtp } from "../../utils/otpUtils";
import { Otp } from "./otp.models";

const OTP_EXPIRATION_MINUTES = 5;

const createOtp = async (userId: Types.ObjectId) => {
  const otp = generateOtp(6);
  const hashed = hashOtp(otp);

  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  await Otp.create({ userId, otp: hashed, expiresAt });

  return otp;
};

const verifyOtp = async (userId: string, otp: string) => {
  const hashed = hashOtp(otp);
  const record = await Otp.findOne({ userId, otp: hashed, verified: false });

  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  record.verified = true;
  await record.save();

  return true;
};

export const otpService = {
  createOtp,
  verifyOtp,
};
