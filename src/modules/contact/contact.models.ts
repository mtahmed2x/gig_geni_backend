import { model, Schema } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>({
  email: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
});

export const Contact = model<IContact>("Contact", contactSchema);
