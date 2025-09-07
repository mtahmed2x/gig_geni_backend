import { Types } from "mongoose";
import { Gender, Sex, UserRole } from "./user.constant";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  verified: boolean;
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: Gender;
  sex: Sex;
  deviceTokens: string[];
}
