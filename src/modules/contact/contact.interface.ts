import { Types } from "mongoose";

export interface IContact {
  _id: Types.ObjectId;
  email: string;
  phoneNumber: string;
  address: string;
}
