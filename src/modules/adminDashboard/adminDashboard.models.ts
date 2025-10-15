import { model, Schema } from "mongoose";
import { IAdminDashboard } from "./adminDashboard.interface";

const adminDashboardSchema = new Schema<IAdminDashboard>({});

export const AdminDashboard = model<IAdminDashboard>("AdminDashboard", adminDashboardSchema);
