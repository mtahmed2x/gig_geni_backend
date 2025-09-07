import { IUser } from "./user.interface";
import { User } from "./user.models";

const createUser = async (payload: Partial<IUser>) => {
  return await User.create(payload);
};

const getAllUser = async () => {
  return await User.find().lean();
};

const getUserById = async (id: string) => {
  return await User.findById(id).lean();
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, payload, { new: true });
};

const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
