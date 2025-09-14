import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/appError";
import { IUser } from "../user/user.interface";
import { userService } from "../user/user.service";
import { otpService } from "../otp/otp.service";
import { generateAuthTokens, verifyRefreshToken } from "../../utils/jwtUtils";
import { User } from "../user/user.models";
import { sendEmail } from "../../utils/sendEmail";

const register = async (payload: Partial<IUser>) => {
  const user = await userService.createUser(payload);
  if (!user)
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  const otp = await otpService.createOtp(user._id);
  if (!otp)
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  const { accessToken, refreshToken } = generateAuthTokens({
    userId: user._id.toString(),
    role: user.role,
  });

  await sendEmail({
    to: user.email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });

  const { password, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    accessToken,
    refreshToken,
    otp: process.env.NODE_ENV !== "production" ? otp : undefined,
  };
};

const verifyOTP = async (userId: string, otp: string) => {
  const isValid = await otpService.verifyOtp(userId, otp);
  if (!isValid) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Bad OTP or OTP expired");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { verified: true },
    { new: true }
  ).lean();

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const { accessToken, refreshToken } = generateAuthTokens({
    userId: user._id.toString(),
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

const resendOTP = async (user: IUser) => {
  const otp = await otpService.createOtp(user._id);
  if (!otp)
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  await sendEmail({
    to: user.email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
  return {
    otp: process.env.NODE_ENV !== "production" ? otp : undefined,
  };
};

const login = async (
  email: string,
  password: string,
  deviceTokens?: string[]
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const isMatch = await (user as any).comparePassword(password);
  if (!isMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.verified) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Please verify your account first"
    );
  }

  if (deviceTokens && deviceTokens.length > 0) {
    const updatedTokens = Array.from(
      new Set([...(user.deviceTokens || []), ...deviceTokens])
    );

    user.deviceTokens = updatedTokens;
    await user.save();
  }

  const { accessToken, refreshToken } = generateAuthTokens({
    userId: user._id.toString(),
    role: user.role,
  });

  const { password: _pw, ...safeUser } = user.toObject();

  return { user: safeUser, accessToken, refreshToken };
};

const refresh = async (token: string) => {
  const decoded = verifyRefreshToken(token);
  if (!decoded?.userId) {
    return new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
  }
  const user = await User.findById(decoded.userId);
  if (!user) {
    return new AppError(StatusCodes.UNAUTHORIZED, "User not found");
  }
  const { accessToken, refreshToken } = generateAuthTokens({
    userId: user._id.toString(),
    role: user.role,
  });

  const { password: _pw, ...safeUser } = user.toObject();

  return { user: safeUser, accessToken, refreshToken };
};

const logout = async (userId: string, deviceToken: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.deviceTokens = (user.deviceTokens || []).filter(
    (token) => token !== deviceToken
  );

  await user.save();

  return { message: "Logged out successfully" };
};

export const authService = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refresh,
  logout,
};
