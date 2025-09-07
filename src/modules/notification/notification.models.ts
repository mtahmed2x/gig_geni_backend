import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";
import { ModelType, NotificationType } from "./notification.constant";

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    referrenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    modelType: {
      type: String,
      enum: Object.values(ModelType),
      required: true,
    },

    data: {
      type: Object,
    },

    read: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
