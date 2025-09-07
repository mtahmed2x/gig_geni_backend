import { Types } from "mongoose";
import { ModelType, NotificationType } from "./notification.constant";

export interface INotification {
  _id: Types.ObjectId;
  type: NotificationType;

  receiver: Types.ObjectId;
  sender?: Types.ObjectId;

  message: string;
  description: string;
  referrenceId: Types.ObjectId;
  modelType: ModelType;
  data?: Record<string, any>;

  read: boolean;
  seenAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
